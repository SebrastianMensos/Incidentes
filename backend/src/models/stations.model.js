"use strict";

const RESOURCE_OPTIONS = require("../config/resource-options");
const {
  createGeoResourceModel,
  createLocationField,
} = require("./create-geo-resource.model");

const stationSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },
  type: {
    type: String,
    required: true,
    enum: RESOURCE_OPTIONS.stations.types,
  },
  status: {
    type: String,
    required: true,
    enum: RESOURCE_OPTIONS.stations.statuses,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  units: {
    type: Number,
    min: 0,
    validate: Number.isInteger,
  },
  location: createLocationField(),
};

module.exports = createGeoResourceModel("Station", "stations", stationSchema);
