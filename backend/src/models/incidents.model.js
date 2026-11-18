"use strict";

const mongoose = require("mongoose");

const { ALLOWED_CATEGORIES, ALLOWED_STATUSES } = require("../middlewares/incident.validator");

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 80,
    },
    category: {
      type: String,
      required: true,
      enum: ALLOWED_CATEGORIES,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },
    status: {
      type: String,
      required: true,
      enum: ALLOWED_STATUSES,
      default: "pendiente",
    },
    // Ubicación en formato GeoJSON
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    // Agrega createdAt y updatedAt automáticamente
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

// Indice geoespacial: permite consultar por cercanía, las agregamos más adelante
incidentSchema.index({ location: "2dsphere" });

// Módelo "Incident" -> colección "incidents" en MongoDB
const IncidentModel = mongoose.model("Incident", incidentSchema);

module.exports = IncidentModel;
