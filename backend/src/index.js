"use strict";

require("dotenv").config();

const dns = require("node:dns");
const app = require("./app");
const { connectDatabase, disconnectDatabase } = require("./config/database");
const seedInitialData = require("./data/seed");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  await connectDatabase();
  await seedInitialData();

  const server = app.listen(PORT, () => {
    console.log("");
    console.log("==============SERVIDOR INCIDENTES URBANOS==============");
    console.log("API DE INCIDENTES URBANOS");
    console.log("===============RUTAS=================");
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`Datos: http://localhost:${PORT}/api/incidents`);
    console.log(`GeoJSON: http://localhost:${PORT}/api/incidents/geojson`);
    console.log(`Estaciones: http://localhost:${PORT}/api/stations`);
    console.log(`Paradas: http://localhost:${PORT}/api/bus-stops`);
    console.log(`Estacionamientos: http://localhost:${PORT}/api/parkings`);
    console.log(`Camaras: http://localhost:${PORT}/api/cameras`);
    console.log("=============RUTAS DISPONIBLES==============");
    console.log("");
  });

  let isShuttingDown = false;
  async function shutdown(signal) {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;
    console.log(`\nSe recibió ${signal}. Cerrando servidor...`);

    server.close(async (error) => {
      if (error) {
        console.error("Error al cerrar el servidor:", error);
        process.exitCode = 1;
      }

      try {
        await disconnectDatabase();
        console.log("Servidor cerrado correctamente.");
      } catch (disconnectError) {
        console.error("Error al cerrar la conexión con MongoDB:", disconnectError);
        process.exitCode = 1;
      }
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error) => {
  console.error("No se pudo iniciar el servidor:", error);
  process.exitCode = 1;
});
