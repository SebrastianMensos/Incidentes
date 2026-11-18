"use strict";

require("dotenv").config();

const { connectDatabase, disconnectDatabase } = require("../config/database");
const IncidentModel = require("../models/incidents.model");
const StationModel = require("../models/stations.model");
const BusStopModel = require("../models/bus-stops.model");
const ParkingModel = require("../models/parkings.model");
const CameraModel = require("../models/cameras.model");
const incidents = require("./incidents.seed");
const stations = require("./stations.seed");
const busStops = require("./bus-stops.seed");
const parkings = require("./parkings.seed");
const cameras = require("./cameras.seed");

const seedCollections = [
  [IncidentModel, incidents],
  [StationModel, stations],
  [BusStopModel, busStops],
  [ParkingModel, parkings],
  [CameraModel, cameras],
];

async function seedInitialData() {
  for (const [model, records] of seedCollections) {
    if ((await model.countDocuments()) > 0) {
      continue;
    }

    const documents = records.map((record) => {
      const document = { ...record };
      delete document.id;
      delete document.createAt;
      return document;
    });
    const inserted = await model.insertMany(documents);
    console.log(`Se insertaron ${inserted.length} registros en ${model.collection.name}.`);
  }
}

async function runSeed() {
  try {
    await connectDatabase();
    await seedInitialData();
  } catch (error) {
    console.error("Error al cargar los datos iniciales:", error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

if (require.main === module) {
  runSeed();
}

module.exports = seedInitialData;
