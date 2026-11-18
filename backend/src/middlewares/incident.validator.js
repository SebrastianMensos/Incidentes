"use strict";

const AppError = require("../utils/appError");

const ALLOWED_CATEGORIES = [
  "bache",
  "alumbrado",
  "basura",
  "fuga",
  "accidente",
];

const ALLOWED_STATUSES = ["pendiente", "atendido"];

const ALLOWED_FIELDS = [
  "title",
  "category",
  "description",
  "status",
  "latitude",
  "longitude",
];

function toFiniteNumber(value) {
  if (
    typeof value !== "number" &&
    (typeof value !== "string" || value.trim() === "")
  ) {
    return Number.NaN;
  }

  return Number(value);
}

function validateIncidentPayload({ partial = false } = {}) {
  return function incidentPayloadValidator(req, res, next) {
    const errors = [];
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return next(
        new AppError(400, "El cuerpo de la solicitud debe ser un objeto JSON."),
      );
    }

    const providedFields = ALLOWED_FIELDS.filter(
      (field) => body[field] !== undefined,
    );

    if (partial && providedFields.length === 0) {
      errors.push("Se requiere al menos un campo para actualizar el incidente.");
    }

    if (!partial) {
      for (const field of ALLOWED_FIELDS) {
        if (
          body[field] === undefined ||
          body[field] === null ||
          body[field] === ""
        ) {
          errors.push(`El campo ${field} es obligatorio.`);
        }
      }
    }

    if (body.title !== undefined) {
      if (
        typeof body.title !== "string" ||
        body.title.trim().length < 4 ||
        body.title.trim().length > 50
      ) {
        errors.push("El campo title debe tener entre 4 y 50 caracteres.");
      }
    }

    if (
      body.category !== undefined &&
      !ALLOWED_CATEGORIES.includes(body.category)
    ) {
      errors.push(
        `El campo category debe ser uno de los siguientes valores: ${ALLOWED_CATEGORIES.join(", ")}.`,
      );
    }

    if (body.description !== undefined) {
      if (
        typeof body.description !== "string" ||
        body.description.trim().length < 10 ||
        body.description.trim().length > 250
      ) {
        errors.push("El campo description debe tener entre 10 y 250 caracteres.");
      }
    }

    if (body.status !== undefined && !ALLOWED_STATUSES.includes(body.status)) {
      errors.push(
        `El campo status debe ser uno de los siguientes valores: ${ALLOWED_STATUSES.join(", ")}.`,
      );
    }

    for (const [field, minimum, maximum] of [
      ["latitude", -90, 90],
      ["longitude", -180, 180],
    ]) {
      if (body[field] === undefined) {
        continue;
      }

      const value = toFiniteNumber(body[field]);
      if (!Number.isFinite(value) || value < minimum || value > maximum) {
        errors.push(
          `El campo ${field} debe ser un número entre ${minimum} y ${maximum}.`,
        );
      } else {
        body[field] = value;
      }
    }

    if (
      (body.latitude === undefined) !== (body.longitude === undefined) &&
      !partial
    ) {
      errors.push("Debe enviar latitude y longitude juntos.");
    }

    const unknownFields = Object.keys(body).filter(
      (field) => !ALLOWED_FIELDS.includes(field),
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

function validateIncidentQuery(req, res, next) {
  const { search, category, status } = req.query;
  const errors = [];

  if (search !== undefined && typeof search !== "string") {
    errors.push("El parámetro search debe ser una cadena de texto.");
  }

  if (
    category !== undefined &&
    category !== "all" &&
    !ALLOWED_CATEGORIES.includes(category)
  ) {
    errors.push(
      `El parámetro category debe ser uno de los siguientes valores: ${ALLOWED_CATEGORIES.join(", ")}.`,
    );
  }

  if (
    status !== undefined &&
    status !== "all" &&
    !ALLOWED_STATUSES.includes(status)
  ) {
    errors.push(
      `El parámetro status debe ser uno de los siguientes valores: ${ALLOWED_STATUSES.join(", ")}.`,
    );
  }

  if (errors.length > 0) {
    return next(new AppError(400, "Errores de validación", errors));
  }

  next();
}

module.exports = {
  validateIncidentPayload,
  validateIncidentQuery,
  ALLOWED_CATEGORIES,
  ALLOWED_STATUSES,
  ALLOWED_FIELDS,
};
