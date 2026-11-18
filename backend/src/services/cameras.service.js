"use strict";

const CameraModel = require("../models/cameras.model");
const MongoResourceService = require("./mongo-resource.service");

class CamerasService extends MongoResourceService {
  constructor() {
    super({
      model: CameraModel,
      label: "la cámara de videovigilancia",
      searchFields: ["name", "description", "type"],
      numericFields: ["rangeMeters"],
    });
  }
}

module.exports = CamerasService;
