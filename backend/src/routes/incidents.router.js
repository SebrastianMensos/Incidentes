"use strict";

const express = require("express");

const IncidentsService = require("../services/incidents.service");
const {
  validateIncidentPayload,
  validateIncidentQuery,
} = require("../middlewares/incident.validator");

const router = express.Router();
const service = new IncidentsService();

router.get("/", validateIncidentQuery, async (req, res) => {
  const incidents = await service.getAll({
    search: req.query.search,
    category: req.query.category,
    status: req.query.status,
  });

  res.status(200).json({
    count: incidents.length,
    data: incidents,
  });
});

router.get("/geojson", validateIncidentQuery, async (req, res) => {
  const geoJSON = await service.getGeoJSON({
    search: req.query.search,
    category: req.query.category,
    status: req.query.status,
  });

  res.status(200).json(geoJSON);
});

router.get("/:id", async (req, res) => {
  const incident = await service.getById(req.params.id);
  res.status(200).json({ data: incident });
});

router.post("/", validateIncidentPayload(), async (req, res) => {
  const newIncident = await service.create(req.body);
  res.status(201).json({
    message: "Incidente registrado correctamente.",
    data: newIncident,
  });
});

router.put(
  "/:id",
  validateIncidentPayload(),
  async (req, res) => {
    const updatedIncident = await service.replace(req.params.id, req.body);
    res.status(200).json({
      message: "Incidente reemplazado correctamente.",
      data: updatedIncident,
    });
  },
);

router.patch(
  "/:id",
  validateIncidentPayload({ partial: true }),
  async (req, res) => {
    const updatedIncident = await service.update(req.params.id, req.body);
    res.status(200).json({
      message: "Incidente actualizado correctamente.",
      data: updatedIncident,
    });
  },
);

router.delete("/:id", async (req, res) => {
  const deletedIncident = await service.delete(req.params.id);
  res.status(200).json({
    message: "Incidente eliminado correctamente.",
    data: {
      id: deletedIncident.id,
      title: deletedIncident.title,
    },
  });
});

module.exports = router;
