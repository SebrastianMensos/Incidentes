"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routerApi = require("./routes");
const AppError = require("./utils/appError");
const {
  notFoundHandler,
  logErrors,
  errorHandler,
} = require("./middlewares/error.handler");

const app = express();

const allowedOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new AppError(403, "Origen no permitido."));
      }
    },
  }),
);

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    name: "API de Incidentes Urbanos",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      incidents: "/api/incidents",
      geojson: "/api/incidents/geojson",
      stations: "/api/stations",
      busStops: "/api/bus-stops",
      parkings: "/api/parkings",
      cameras: "/api/cameras",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "El servidor funciona correctamente",
    timestamp: new Date().toISOString(),
  });
});

routerApi(app);

app.use(notFoundHandler);
app.use(logErrors);
app.use(errorHandler);

module.exports = app;
