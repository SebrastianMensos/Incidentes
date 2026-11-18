"use strict";

const RESOURCE_OPTIONS = require("../config/resource-options");
const {
  createGeoResourceModel,
  createLocationField,
} = require("./create-geo-resource.model");

const cameraSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },
  type: {
    type: String,
    required: true,
    enum: RESOURCE_OPTIONS.cameras.types,
  },
  status: {
    type: String,
    required: true,
    enum: RESOURCE_OPTIONS.cameras.statuses,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  rangeMeters: {
    type: Number,
    min: 0,
    validate: Number.isInteger,
  },
  location: createLocationField(),
};

module.exports = createGeoResourceModel("Camera", "cameras", cameraSchema);
