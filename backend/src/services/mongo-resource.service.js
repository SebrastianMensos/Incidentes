"use strict";

const mongoose = require("mongoose");
const AppError = require("../utils/appError");

class MongoResourceService {
  constructor({ model, label, searchFields, numericFields }) {
    this.model = model;
    this.label = label;
    this.searchFields = searchFields;
    this.numericFields = numericFields;
  }

  async getAll(filters = {}) {
    const { search = "", type = "all", status = "all" } = filters;
    const query = {};

    if (type !== "all") {
      query.type = type;
    }

    if (status !== "all") {
      query.status = status;
    }

    const text = search.trim();
    if (text) {
      const regex = new RegExp(this.escapeRegex(text), "i");
      query.$or = this.searchFields.map((field) => ({ [field]: regex }));
    }

    return this.model.find(query).sort({ createdAt: -1 });
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, `El id ${id} no es válido.`);
    }

    const item = await this.model.findById(id);
    if (!item) {
      throw new AppError(404, `No se encontró ${this.label} con el id ${id}.`);
    }

    return item;
  }

  async getGeoJSON(filters = {}) {
    const items = await this.getAll(filters);
    return {
      type: "FeatureCollection",
      features: items.map((item) => ({
        type: "Feature",
        properties: {
          id: item.id,
          name: item.name,
          type: item.type,
          status: item.status,
          description: item.description,
          ...Object.fromEntries(
            this.numericFields.map((field) => [field, item[field]]),
          ),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        },
        geometry: item.location || null,
      })),
    };
  }

  async create(data) {
    return this.model.create(this.toPersistenceData(data));
  }

  async update(id, data, { partial = false } = {}) {
    const item = await this.getById(id);
    const payload = this.toPersistenceData(data, item.location, partial);
    const fields = [
      "name",
      "type",
      "status",
      "description",
      ...this.numericFields,
      "location",
    ];

    for (const field of fields) {
      if (Object.hasOwn(payload, field)) {
        item[field] = payload[field];
      } else if (!partial) {
        item[field] = undefined;
      }
    }

    await item.save();
    return item;
  }

  async delete(id) {
    const item = await this.getById(id);
    await this.model.findByIdAndDelete(id);
    return item;
  }

  toPersistenceData(data, currentLocation, partial = false) {
    const payload = { ...data };
    const { longitude, latitude, location } = payload;
    delete payload.longitude;
    delete payload.latitude;

    if (location !== undefined) {
      payload.location = location;
    } else if (longitude !== undefined || latitude !== undefined) {
      const coordinates =
        partial && currentLocation ? [...currentLocation.coordinates] : [];

      if (longitude !== undefined) {
        coordinates[0] = Number(longitude);
      }

      if (latitude !== undefined) {
        coordinates[1] = Number(latitude);
      }

      if (
        coordinates.length !== 2 ||
        !Number.isFinite(coordinates[0]) ||
        !Number.isFinite(coordinates[1])
      ) {
        throw new AppError(
          400,
          "Se requieren longitude y latitude para definir location.",
        );
      }

      payload.location = {
        type: "Point",
        coordinates,
      };
    }

    return payload;
  }

  escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

module.exports = MongoResourceService;
