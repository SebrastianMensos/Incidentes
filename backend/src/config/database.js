"use strict";

const mongoose = require("mongoose");

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Falta la variable MONGODB_URI en el archivo .env");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log(`MongoDB conectado a la base: ${mongoose.connection.name}`);
  } catch (error) {
    for (const [address, server] of error.reason?.servers ?? []) {
      console.error(address, "->", server.error?.message);
    }

    throw error;
  }
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
