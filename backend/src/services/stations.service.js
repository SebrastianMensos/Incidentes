"use strict";

const StationModel = require("../models/stations.model");
const MongoResourceService = require("./mongo-resource.service");

class StationsService extends MongoResourceService {
  constructor() {
    super({
      model: StationModel,
      label: "la estación de emergencia",
      searchFields: ["name", "description", "type"],
      numericFields: ["units"],
    });
  }
}

module.exports = StationsService;
