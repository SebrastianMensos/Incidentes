"use strict";

const mongoose = require("mongoose");

const { randomUUID } = require("node:crypto");

const AppError = require("../utils/appError");
const IncidentModel = require("../models/incidents.model");

class IncidentsService {
  //Obtenemos todos con filtros
  async getAll(filters = {}) {
  const{
    search = "",
    category = "all",
    status = "all",
  } = filters;

  const query = {};


    if (category !== "all") {
      query.category = category;
    }

    if (status !== "all") {
      query.status = status;
    }

    const text = search.trim();

    if(text) {
      const regex = new RegExp(this.escapeRegex(text), "i");

      query.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
      ]
    }


    // Los más recientes aparecerán primero
    return IncidentModel.find(query).sort({ createdAt: -1 });
  }

  // Obtener por ID
  async getById(id) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, `El id ${id} no es válido`);
    }

    const incident = await IncidentModel.findById(id);

    if (!incident) {
      throw new AppError(404, `No se encontro el incidente con el id ${id}`);
    }

    return incident;
  }

  async getGeoJSON(filters = {}) {
    const incidents = await this.getAll(filters);

    return {
      type: "FeatureCollection",
      features: incidents.map((incident) => ({
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
    const currentDate = new Date().toISOString();

    const newIncident = {
      id: `INC-${randomUUID()}`,
      title: data.title.trim(),
      category: data.category,
      description: data.description.trim(),
      status: data.status,
      location: {
        type: "Point",
        // GeoJSON siempre guarda [Longitud, Latitud]
        coordinates: [Number(data.longitude), Number(data.latitude)],
      },
      createdAt: currentDate,
      updatedAt: currentDate,
    };
    const savedIncident = await IncidentModel.create(newIncident);
    return savedIncident;
  }

  async update(id, changes) {
    const incident = await this.getById(id);

    if (changes.title) {
      incident.title = changes.title.trim();
    }

    if (changes.category) {
      incident.category = changes.category;
    }

    if (changes.description) {
      incident.description = changes.description.trim();
    }

    if (changes.status) {
      incident.status = changes.status;
    }

    if (changes.latitude && changes.longitude) {
      incident.location.coordinates = [
        Number(changes.longitude),
        Number(changes.latitude),
      ];
    }

    incident.updatedAt = new Date().toISOString();

    await incident.save();

    return incident;
  }

  async delete(id) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, `El id ${id} no es válido`);
    }

    const incident = await this.getById(id);

    await IncidentModel.findByIdAndDelete(id);

    return incident;
  }

  escapeRegex(value){
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

module.exports = IncidentsService;
