"use strict";

const mongoose = require("mongoose");

const geoPointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (coordinates) => coordinates.length === 2,
        message: "Las coordenadas deben tener longitud y latitud.",
      },
    },
  },
  { _id: false, id: false },
);

module.exports = geoPointSchema;
