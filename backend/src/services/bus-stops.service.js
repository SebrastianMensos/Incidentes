"use strict";

const BusStopModel = require("../models/bus-stops.model");
const MongoResourceService = require("./mongo-resource.service");

class BusStopsService extends MongoResourceService {
  constructor() {
    super({
      model: BusStopModel,
      label: "la parada de autobús",
      searchFields: ["name", "description", "type"],
      numericFields: ["routesCount"],
    });
  }
}

module.exports = BusStopsService;
