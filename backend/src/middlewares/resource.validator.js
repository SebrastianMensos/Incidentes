"use strict";

const AppError = require("../utils/appError");

function toFiniteNumber(value) {
  if (
    typeof value !== "number" &&
    (typeof value !== "string" || value.trim() === "")
  ) {
    return Number.NaN;
  }

  return Number(value);
}

function validateResourceQuery(options) {
  return function resourceQueryValidator(req, res, next) {
    const { search, type, status } = req.query;
    const errors = [];

    if (search !== undefined && typeof search !== "string") {
      errors.push("El parámetro search debe ser una cadena de texto.");
    }

    if (
      type !== undefined &&
      type !== "all" &&
      !options.types.includes(type)
    ) {
      errors.push(
        `El parámetro type debe ser uno de los siguientes valores: ${options.types.join(", ")}.`,
      );
    }

    if (
      status !== undefined &&
      status !== "all" &&
      !options.statuses.includes(status)
    ) {
      errors.push(
        `El parámetro status debe ser uno de los siguientes valores: ${options.statuses.join(", ")}.`,
      );
    }

    if (errors.length > 0) {
      return next(new AppError(400, "Errores de validación", errors));
    }

    next();
  };
}

function validateResourcePayload(options, { partial = false } = {}) {
  const allowedFields = new Set([
    ...options.requiredFields,
    ...Object.keys(options.enumFields),
    ...Object.keys(options.numericFields),
    "location",
    "longitude",
    "latitude",
  ]);

  return function resourcePayloadValidator(req, res, next) {
    const errors = [];
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return next(
        new AppError(400, "El cuerpo de la solicitud debe ser un objeto JSON."),
      );
    }

    const providedFields = Object.keys(body).filter((field) =>
      allowedFields.has(field),
    );

    if (partial && providedFields.length === 0) {
      errors.push("Se requiere al menos un campo para actualizar el registro.");
    }

    for (const field of options.requiredFields) {
      if (
        !partial &&
        (body[field] === undefined ||
          body[field] === null ||
          body[field] === "")
      ) {
        errors.push(`El campo ${field} es obligatorio.`);
      }

      if (body[field] !== undefined) {
        const maxLength = options.maxLengths[field];
        if (
          typeof body[field] !== "string" ||
          body[field].trim().length === 0 ||
          (maxLength && body[field].trim().length > maxLength)
        ) {
          errors.push(
            `El campo ${field} debe ser texto no vacío${maxLength ? ` de no más de ${maxLength} caracteres` : ""}.`,
          );
        }
      }
    }

    for (const [field, values] of Object.entries(options.enumFields)) {
      if (
        body[field] === undefined &&
        !partial &&
        options.requiredFields.includes(field)
      ) {
        continue;
      }

      if (body[field] !== undefined && !values.includes(body[field])) {
        errors.push(
          `El campo ${field} debe ser uno de los siguientes valores: ${values.join(", ")}.`,
        );
      }
    }

    for (const [field, constraints] of Object.entries(options.numericFields)) {
      if (body[field] === undefined) {
        continue;
      }

      const value = toFiniteNumber(body[field]);
      if (
        !Number.isFinite(value) ||
        (constraints.integer && !Number.isInteger(value)) ||
        value < constraints.min
      ) {
        errors.push(
          `El campo ${field} debe ser un número ${constraints.integer ? "entero " : ""}mayor o igual a ${constraints.min}.`,
        );
      } else {
        body[field] = value;
      }
    }

    const hasLongitude = body.longitude !== undefined;
    const hasLatitude = body.latitude !== undefined;
    const hasLocation = body.location !== undefined;

    if (hasLocation && (hasLongitude || hasLatitude)) {
      errors.push("Envía location o latitude/longitude, pero no ambos formatos.");
    }

    if (hasLongitude !== hasLatitude && (!partial || hasLocation)) {
      errors.push("Debe enviar longitude y latitude juntos.");
    }

    if (hasLocation) {
      const { type, coordinates } = body.location || {};
      if (
        !body.location ||
        typeof body.location !== "object" ||
        Array.isArray(body.location) ||
        type !== "Point" ||
        !Array.isArray(coordinates) ||
        coordinates.length !== 2
      ) {
        errors.push(
          "location debe ser un Point con coordenadas [longitude, latitude].",
        );
      } else {
        const [longitude, latitude] = coordinates.map(toFiniteNumber);
        if (
          !Number.isFinite(longitude) ||
          longitude < -180 ||
          longitude > 180 ||
          !Number.isFinite(latitude) ||
          latitude < -90 ||
          latitude > 90
        ) {
          errors.push("location contiene coordenadas fuera de rango.");
        } else {
          body.location.coordinates = [longitude, latitude];
        }
      }
    }

    if (hasLongitude) {
      const longitude = toFiniteNumber(body.longitude);
      if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        errors.push("El campo longitude debe ser un número entre -180 y 180.");
      } else {
        body.longitude = longitude;
      }
    }

    if (hasLatitude) {
      const latitude = toFiniteNumber(body.latitude);
      if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
        errors.push("El campo latitude debe ser un número entre -90 y 90.");
      } else {
        body.latitude = latitude;
      }
    }

    const unknownFields = Object.keys(body).filter(
      (field) => !allowedFields.has(field),
    );
    if (unknownFields.length > 0) {
      errors.push(
        `Se encontraron campos no permitidos: ${unknownFields.join(", ")}.`,
      );
    }

    if (errors.length > 0) {
      return next(new AppError(400, "Errores de validación", errors));
    }

    next();
  };
}

module.exports = {
  validateResourcePayload,
  validateResourceQuery,
};
