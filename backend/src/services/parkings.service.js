"use strict";

const ParkingModel = require("../models/parkings.model");
const MongoResourceService = require("./mongo-resource.service");

class ParkingsService extends MongoResourceService {
  constructor() {
    super({
      model: ParkingModel,
      label: "el estacionamiento público",
      searchFields: ["name", "description", "type"],
      numericFields: ["capacity"],
    });
  }
}

module.exports = ParkingsService;
