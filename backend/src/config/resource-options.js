"use strict";

const RESOURCE_OPTIONS = {
  stations: {
    types: ["bomberos", "policia", "proteccion_civil"],
    statuses: ["activa", "inactiva"],
    numericField: "units",
  },
  busStops: {
    types: ["troncal", "alimentadora", "auxiliar"],
    statuses: ["operando", "suspendida"],
    numericField: "routesCount",
  },
  parkings: {
    types: ["superficie", "techado", "subterraneo"],
    statuses: ["abierto", "lleno", "cerrado"],
    numericField: "capacity",
  },
  cameras: {
    types: ["fija", "ptz", "lectora_placas"],
    statuses: ["activa", "falla", "mantenimiento"],
    numericField: "rangeMeters",
  },
};

module.exports = RESOURCE_OPTIONS;
