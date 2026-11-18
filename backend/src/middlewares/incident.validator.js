"use strict";AbortController

const AppError = require("../utils/appError");

const ALLOWED_CATEGORIES = [
    "bache",
    "alumbrado",
    "basura",
    "fuga",
    "accidente",
];

const ALLOWED_STATUSES = [
    "pendiente",
    "atendido",
];

const ALLOWED_FIELDS = [
    "title",
    "category",
    "description",
    "status",
    "latitude",
    "longitude"
];

function validateIncidentPayload(options={}) {
    const {partial = false} = options;

    return function incidentPayloadValidator(req, res, next) {
        const errors = [];
        const body = req.body || {};

        const providedFields = ALLOWED_FIELDS.filter(
            (field) => body[field] !== undefined
        );

        if(partial && providedFields.length === 0){
            errors.push("Se requiere al menos un campo para actualizar el incidente");
        }

        if(!partial){
            ALLOWED_FIELDS.forEach((field) => {
                if(
                    body[field] === undefined ||
                    body[field] === null ||
                    body[field] === ""
                ){
                    errors.push(`El campo ${field} es obligatorio`);
                }
            });
        }

        if(body.title !== undefined){
            if(typeof body.title !== "string" || body.title.trim().length <4){
                errors.push("El campo title debe ser una cadena de texto con al menos 4 caracteres");
            }

            if(typeof body.title === "string" && body.title.trim().length > 50){
                errors.push("El campo title debe ser una cadena de texto con no más de 50 caracteres");
            }
        }

        if(body.category !== undefined &&
            !ALLOWED_CATEGORIES.includes(body.category)
        ){
            errors.push(`El campo category debe ser uno de los siguientes valores: ${ALLOWED_CATEGORIES.join(", ")}`);
        }

        if(body.description !== undefined){
            if(typeof body.description !== "string" || body.description.trim().length < 10){
                errors.push("El campo description debe ser una cadena de texto con al menos 10 caracteres");
            }
            if(typeof body.description === "string" && body.description.trim().length > 500){
                errors.push("El campo description debe ser una cadena de texto con no más de 500 caracteres");
            }
        }
        
        if(body.status !== undefined &&
            !ALLOWED_STATUSES.includes(body.status)
        ){
            errors.push(`El campo status debe ser uno de los siguientes valores: ${ALLOWED_STATUSES.join(", ")}`);
        }

        if(body.latitude !== undefined){
            const latitude = Number(body.latitude);

            if(!Number.isFinite(latitude)){
                errors.push("El campo latitude debe ser un número válido");
            } else if(latitude < -180 || latitude > 180){
                errors.push("El campo latitude debe ser un número entre -180 y 180");
            } else {
                req.body.latitude = latitude;
            }
        }

        if(body.longitude !== undefined){
            const longitude = Number(body.longitude);

            if(!Number.isFinite(longitude)){
                errors.push("El campo longitude debe ser un número válido");
            } else if(longitude < -180 || longitude > 180){
                errors.push("El campo longitude debe ser un número entre -180 y 180");
            } else {
                req.body.longitude = longitude;
            }
        }

        const unknownFields = Object.keys(body).filter(
            (field) => !ALLOWED_FIELDS.includes(field)
        );

        if(unknownFields.length > 0){
            errors.push(`Se encontraron campos no permitidos: ${unknownFields.join(", ")}`);
        }

        if(errors.length > 0){
            return next(new AppError(400, "Errores de validación", errors));
        }

        next();
    };
}

function validateIncidentQuery(req, res, next) {
    const {search, category, status} = req.query;

    const errors = [];

    if(search !== undefined && typeof search !== "string"){
        errors.push("El parámetro search debe ser una cadena de texto");
    }

    if(
        category !== undefined &&
        categeory !== "all" &&
        !ALLOWED_CATEGORIES.includes(category)
    ){
        errors.push(`El parámetro category debe ser uno de los siguientes valores: ${ALLOWED_CATEGORIES.join(", ")}`);
    }
    if(
        status !== undefined &&
        status !== "all" &&
        !ALLOWED_STATUSES.includes(status)
    ){
        errors.push(`El parámetro status debe ser uno de los siguientes valores: ${ALLOWED_STATUSES.join(", ")}`);
    }

    if(errors.length > 0){
        return next(new AppError(400, "Errores de validación", errors));
    };
}

module.exports = {
    validateIncidentPayload,
    validateIncidentQuery,
    ALLOWED_CATEGORIES,
    ALLOWED_STATUSES,
    ALLOWED_FIELDS
}