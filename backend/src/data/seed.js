"use strict";

require("dotenv").config();

const { connectDatabase, disconnectDatabase } = require("../config/database");

const IncidentModel = require("../models/incident.model");
const seedIncidents = require("./incidents.seed");

async function runSeed() {
  try {
    // Abrir conexión a base de datos
    await connectDatabase();

    // Vacías la colección para no duplicar datos
    await IncidentModel.deleteMany({});

    // Quitamos id, createdAt, y updatedAt porque los pone MongoDB
    const documents = seedIncidents.map(({ id, createdAt, updatedAt, ...incident }) => incident);

    const inserted = await IncidentModel.insertMany(documents);

    console.log(`Se insertaron los registros ${inserted.length}`);
  } catch (error) {
    console.error("Error al cargar los datos: ", error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

runSeed();
