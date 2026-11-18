"use strict";

const RESOURCE_OPTIONS = require("../config/resource-options");
const {
  createGeoResourceModel,
  createLocationField,
} = require("./create-geo-resource.model");

const parkingSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },
  type: {
    type: String,
    required: true,
    enum: RESOURCE_OPTIONS.parkings.types,
  },
  status: {
    type: String,
    required: true,
    enum: RESOURCE_OPTIONS.parkings.statuses,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  capacity: {
    type: Number,
    min: 0,
    validate: Number.isInteger,
  },
  location: createLocationField(),
};

module.exports = createGeoResourceModel("Parking", "parkings", parkingSchema);
