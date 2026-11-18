"use strict"

const app = require("./app")

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const { connectDatabase } = require("./config/database")

const PORT = Number(process.env.PORT) || 3000

async function startServer() { 
    try {
        await connectDatabase();
        console.log("Conexión a la base de datos establecida");
        
const server= app.listen(PORT, () =>{
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
    console.log("=============RUTAS DISPONIBLES==============")
    console.log("")
});

// Cierre controlado, cuando el servidor lo quiera y corta la conexión con MongoDB
    function shutdown(signal) {
      console.log(`\nSe recibió ${signal}. Cerrando servidor...`);

      server.close(() => {
        disconnectDatabase;
        console.log("Servidor cerrado correctamente.");
        process.exit(0);
      });
    }
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    } catch (error) {
    console.error("No se pudo conectar a MongoDB", error.message);
    process.exit(1);
  }
}

startServer();

