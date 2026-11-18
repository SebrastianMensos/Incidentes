"use strict";

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require("mongoose");

// Abre la conexión con MongoDB usando la cadena del .env
async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Falta la variable MONGODB_URI en el archivo .env");
  }

  await mongoose.connect(uri);

  console.log(`MongoDB conectado a la base: ${mongoose.connection.name}`);
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
