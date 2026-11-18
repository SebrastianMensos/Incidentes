"use strict";

const mongoose = require("mongoose");

const AppError = require("../utils/appError");
const IncidentModel = require("../models/incidents.model");

class IncidentsService {
  async getAll(filters = {}) {
    const { search = "", category = "all", status = "all" } = filters;
    const query = {};

    if (category !== "all") {
      query.category = category;
    }

    if (status !== "all") {
      query.status = status;
    }

    const text = search.trim();
    if (text) {
      const regex = new RegExp(this.escapeRegex(text), "i");
      query.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
      ];
    }

    return IncidentModel.find(query).sort({ createdAt: -1 });
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, `El id ${id} no es válido.`);
    }

    const incident = await IncidentModel.findById(id);
    if (!incident) {
      throw new AppError(404, `No se encontró el incidente con el id ${id}.`);
    }

    return incident;
  }

  async getGeoJSON(filters = {}) {
    const incidents = await this.getAll(filters);
    return {
      type: "FeatureCollection",
      features: incidents.map((incident) => ({
        type: "Feature",
        properties: {
          id: incident.id,
          title: incident.title,
          category: incident.category,
          description: incident.description,
          status: incident.status,
          createdAt: incident.createdAt,
          updatedAt: incident.updatedAt,
        },
        geometry: incident.location,
      })),
    };
  }

  async create(data) {
    return IncidentModel.create({
      title: data.title.trim(),
      category: data.category,
      description: data.description.trim(),
      status: data.status,
      location: {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      },
    });
  }

  async replace(id, data) {
    const incident = await this.getById(id);
    incident.title = data.title.trim();
    incident.category = data.category;
    incident.description = data.description.trim();
    incident.status = data.status;
    incident.location = {
      type: "Point",
      coordinates: [data.longitude, data.latitude],
    };

    await incident.save();
    return incident;
  }

  async update(id, changes) {
    const incident = await this.getById(id);

    if (changes.title !== undefined) {
      incident.title = changes.title.trim();
    }
    if (changes.category !== undefined) {
      incident.category = changes.category;
    }
    if (changes.description !== undefined) {
      incident.description = changes.description.trim();
    }
    if (changes.status !== undefined) {
      incident.status = changes.status;
    }
    if (changes.latitude !== undefined || changes.longitude !== undefined) {
      const coordinates = [...incident.location.coordinates];
      if (changes.longitude !== undefined) {
        coordinates[0] = changes.longitude;
      }
      if (changes.latitude !== undefined) {
        coordinates[1] = changes.latitude;
      }
      incident.location.coordinates = coordinates;
    }

    await incident.save();
    return incident;
  }

  async delete(id) {
    const incident = await this.getById(id);
    await IncidentModel.findByIdAndDelete(id);
    return incident;
  }

  escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

module.exports = IncidentsService;
