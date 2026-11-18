"use strict";

const AppError = require("../utils/appError");

function notFoundHandler(req, res, next) {
  next(
    new AppError(
      404,
      `No existe la ruta ${req.method} ${req.originalUrl}.`,
    ),
  );
}

function logErrors(error, req, res, next) {
  console.error("-------ERROR-------");
  console.error("Fecha:", new Date().toISOString());
  console.error("Método:", req.method);
  console.error("Ruta:", req.originalUrl);
  console.error("Mensaje:", error.message);

  if (error.stack) {
    console.error(error.stack);
  }

  console.error("-------------------");
  next(error);
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      error: {
        status: 400,
        message: "El cuerpo JSON tiene un error de sintaxis.",
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
      },
    });
  }

  const statusCode = error.statusCode || 500;
  const message =
    statusCode === 500
      ? "Ocurrió un error interno en el servidor."
      : error.message;

  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
      details: error.details || null,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    },
  });
}

module.exports = {
  notFoundHandler,
  logErrors,
  errorHandler,
};
