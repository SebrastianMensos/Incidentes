"use strict";

const express = require("express");

const RESOURCE_OPTIONS = require("../config/resource-options");
const {
  validateResourcePayload,
  validateResourceQuery,
} = require("../middlewares/resource.validator");
const StationsService = require("../services/stations.service");

const router = express.Router();
const service = new StationsService();
const options = RESOURCE_OPTIONS.stations;
const validationOptions = {
  requiredFields: ["name", "type", "status", "description"],
  enumFields: {
    type: options.types,
    status: options.statuses,
  },
  numericFields: {
    [options.numericField]: { integer: true, min: 0 },
  },
  maxLengths: {
    name: 80,
    description: 500,
  },
};

router.get("/", validateResourceQuery(options), async (req, res) => {
  const items = await service.getAll({
    search: req.query.search,
    type: req.query.type,
    status: req.query.status,
  });

  res.status(200).json({
    count: items.length,
    data: items,
  });
});

router.get("/geojson", validateResourceQuery(options), async (req, res) => {
  const geoJSON = await service.getGeoJSON({
    search: req.query.search,
    type: req.query.type,
    status: req.query.status,
  });

  res.status(200).json(geoJSON);
});

router.post(
  "/",
  validateResourcePayload(validationOptions),
  async (req, res) => {
    const item = await service.create(req.body);

    res.status(201).json({
      message: "Estación registrada correctamente.",
      data: item,
    });
  },
);

router.get("/:id", async (req, res) => {
  const item = await service.getById(req.params.id);
  res.status(200).json({ data: item });
});

router.put(
  "/:id",
  validateResourcePayload(validationOptions),
  async (req, res) => {
    const item = await service.update(req.params.id, req.body);
    res.status(200).json({
      message: "Estación actualizada correctamente.",
      data: item,
    });
  },
);

router.patch(
  "/:id",
  validateResourcePayload(validationOptions, { partial: true }),
  async (req, res) => {
    const item = await service.update(req.params.id, req.body, {
      partial: true,
    });
    res.status(200).json({
      message: "Estación actualizada correctamente.",
      data: item,
    });
  },
);

router.delete("/:id", async (req, res) => {
  const item = await service.delete(req.params.id);
  res.status(200).json({
    message: "Estación eliminada correctamente.",
    data: {
      id: item.id,
      name: item.name,
    },
  });
});

module.exports = router;
