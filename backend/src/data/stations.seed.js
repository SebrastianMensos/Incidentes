"use strict";

const stations = [
    {
        id: "STA-001",
        name: "Estación Central de Bomberos León",
        type: "bomberos",
        status: "activa",
        description: "Estación principal de bomberos con atención a incendios, rescates y emergencias en la zona centro",
        units: 15,
        location: {
            type: "Point",
            coordinates: [-101.6905, 21.1195]
        },
        createdAt: "2026-01-10T12:00:00.000Z",
        updatedAt: "2026-01-10T12:00:00.000Z"
    },
    {
        id: "STA-002",
        name: "Estación de Bomberos Zona Oriente",
        type: "bomberos",
        status: "activa",
        description: "Estación de respuesta rápida para colonias del oriente de la ciudad",
        units: 8,
        location: {
            type: "Point",
            coordinates: [-101.642, 21.126]
        },
        createdAt: "2026-01-12T12:00:00.000Z",
        updatedAt: "2026-01-12T12:00:00.000Z"
    },
    {
        id: "STA-003",
        name: "Comandancia de Policía Municipal Centro",
        type: "policia",
        status: "activa",
        description: "Comandancia con patrullas y personal de vigilancia para el centro histórico",
        units: 30,
        location: {
            type: "Point",
            coordinates: [-101.6835, 21.123]
        },
        createdAt: "2026-01-14T12:00:00.000Z",
        updatedAt: "2026-01-14T12:00:00.000Z"
    },
    {
        id: "STA-004",
        name: "Base de Policía Zona Norte",
        type: "policia",
        status: "inactiva",
        description: "Base operativa de policía temporalmente fuera de operación por remodelación",
        units: 12,
        location: {
            type: "Point",
            coordinates: [-101.677, 21.158]
        },
        createdAt: "2026-01-18T12:00:00.000Z",
        updatedAt: "2026-01-18T12:00:00.000Z"
    },
    {
        id: "STA-005",
        name: "Protección Civil Municipal León",
        type: "proteccion_civil",
        status: "activa",
        description: "Oficinas y centro de coordinación de protección civil para contingencias",
        units: 20,
        location: {
            type: "Point",
            coordinates: [-101.67, 21.11]
        },
        createdAt: "2026-01-20T12:00:00.000Z",
        updatedAt: "2026-01-20T12:00:00.000Z"
    },
    {
        id: "STA-006",
        name: "Base Operativa Protección Civil Poniente",
        type: "proteccion_civil",
        status: "inactiva",
        description: "Base de apoyo en el poniente que opera únicamente en temporada de lluvias",
        units: 6,
        location: {
            type: "Point",
            coordinates: [-101.725, 21.118]
        },
        createdAt: "2026-01-22T12:00:00.000Z",
        updatedAt: "2026-01-22T12:00:00.000Z"
    }
];

module.exports = stations;
