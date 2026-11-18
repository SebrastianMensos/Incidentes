"use strict";

const {
  ALLOWED_CATEGORIES,
  ALLOWED_STATUSES,
} = require("../middlewares/incident.validator");
const {
  createGeoResourceModel,
  createLocationField,
} = require("./create-geo-resource.model");

const incidentSchema = {
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
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
  location: createLocationField(true),
};

module.exports = createGeoResourceModel(
  "Incident",
  "incidents",
  incidentSchema,
);
