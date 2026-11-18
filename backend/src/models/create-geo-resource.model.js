"use strict";

const mongoose = require("mongoose");

const geoPointSchema = require("./geo-point.schema");

function createGeoResourceModel(modelName, collectionName, fields) {
  const schema = new mongoose.Schema(fields, {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  });

  schema.index({ location: "2dsphere" });

  return mongoose.models[modelName] ||
    mongoose.model(modelName, schema, collectionName);
}

function createLocationField(required = false) {
  return {
    type: geoPointSchema,
    required,
  };
}

module.exports = {
  createGeoResourceModel,
  createLocationField,
};
