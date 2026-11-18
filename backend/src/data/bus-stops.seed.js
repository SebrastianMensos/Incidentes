"use strict";

const busStops = [
    {
        id: "BUS-001",
        name: "Parada Blvd. Adolfo López Mateos Centro",
        type: "troncal",
        status: "operando",
        description: "Parada troncal con alta afluencia de pasajeros sobre el corredor principal",
        routesCount: 18,
        location: {
            type: "Point",
            coordinates: [-101.685, 21.12]
        },
        createdAt: "2026-02-01T12:00:00.000Z",
        updatedAt: "2026-02-01T12:00:00.000Z"
    },
    {
        id: "BUS-002",
        name: "Parada Blvd. Francisco Villa",
        type: "troncal",
        status: "operando",
        description: "Parada troncal de conexión con rutas hacia el poniente de la ciudad",
        routesCount: 22,
        location: {
            type: "Point",
            coordinates: [-101.701, 21.1105]
        },
        createdAt: "2026-02-03T12:00:00.000Z",
        updatedAt: "2026-02-03T12:00:00.000Z"
    },
    {
        id: "BUS-003",
        name: "Parada Blvd. Hilario Medina",
        type: "alimentadora",
        status: "operando",
        description: "Parada alimentadora que conecta colonias con el corredor troncal",
        routesCount: 9,
        location: {
            type: "Point",
            coordinates: [-101.66, 21.119]
        },
        createdAt: "2026-02-05T12:00:00.000Z",
        updatedAt: "2026-02-05T12:00:00.000Z"
    },
    {
        id: "BUS-004",
        name: "Parada Plaza Principal",
        type: "auxiliar",
        status: "operando",
        description: "Parada auxiliar cercana a la plaza principal y a la zona de comercios",
        routesCount: 6,
        location: {
            type: "Point",
            coordinates: [-101.6827, 21.1219]
        },
        createdAt: "2026-02-07T12:00:00.000Z",
        updatedAt: "2026-02-07T12:00:00.000Z"
    },
    {
        id: "BUS-005",
        name: "Parada Blvd. Torres Landa",
        type: "alimentadora",
        status: "suspendida",
        description: "Parada suspendida temporalmente por obras de mantenimiento vial",
        routesCount: 7,
        location: {
            type: "Point",
            coordinates: [-101.654, 21.133]
        },
        createdAt: "2026-02-09T12:00:00.000Z",
        updatedAt: "2026-02-09T12:00:00.000Z"
    },
    {
        id: "BUS-006",
        name: "Parada Blvd. Campestre",
        type: "auxiliar",
        status: "suspendida",
        description: "Parada auxiliar sin servicio por reubicación de rutas",
        routesCount: 4,
        location: {
            type: "Point",
            coordinates: [-101.695, 21.14]
        },
        createdAt: "2026-02-11T12:00:00.000Z",
        updatedAt: "2026-02-11T12:00:00.000Z"
    }
];

module.exports = busStops;
