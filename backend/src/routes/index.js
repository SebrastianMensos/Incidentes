"use strict";

const express = require("express");

const incidentsRouter = require("./incidents.router");
const stationsRouter = require("./stations.router");
const busStopsRouter = require("./bus-stops.router");
const parkingsRouter = require("./parkings.router");
const camerasRouter = require("./cameras.router");

function routerApi(app) {
  const apiRouter = express.Router();

  app.use("/api", apiRouter);
  apiRouter.use("/incidents", incidentsRouter);
  apiRouter.use("/stations", stationsRouter);
  apiRouter.use("/bus-stops", busStopsRouter);
  apiRouter.use("/parkings", parkingsRouter);
  apiRouter.use("/cameras", camerasRouter);
}

module.exports = routerApi;
