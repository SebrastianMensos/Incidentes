"use strict";

const parkings = [
    {
        id: "PAR-001",
        name: "Estacionamiento Poliforum León",
        type: "superficie",
        status: "abierto",
        description: "Amplio estacionamiento al aire libre para eventos y exposiciones",
        capacity: 4000,
        location: {
            type: "Point",
            coordinates: [-101.6105, 21.101]
        },
        createdAt: "2026-03-01T12:00:00.000Z",
        updatedAt: "2026-03-01T12:00:00.000Z"
    },
    {
        id: "PAR-002",
        name: "Estacionamiento Plaza Mayor",
        type: "superficie",
        status: "abierto",
        description: "Estacionamiento de superficie para visitantes de la plaza comercial y de entretenimiento",
        capacity: 3500,
        location: {
            type: "Point",
            coordinates: [-101.6637, 21.1514]
        },
        createdAt: "2026-03-03T12:00:00.000Z",
        updatedAt: "2026-03-03T12:00:00.000Z"
    },
    {
        id: "PAR-003",
        name: "Estacionamiento Centro Histórico",
        type: "techado",
        status: "lleno",
        description: "Estacionamiento techado de alta demanda en horario comercial",
        capacity: 250,
        location: {
            type: "Point",
            coordinates: [-101.684, 21.1235]
        },
        createdAt: "2026-03-05T12:00:00.000Z",
        updatedAt: "2026-03-05T12:00:00.000Z"
    },
    {
        id: "PAR-004",
        name: "Estacionamiento Mercado Hidalgo",
        type: "techado",
        status: "abierto",
        description: "Estacionamiento techado para locatarios y clientes del mercado",
        capacity: 180,
        location: {
            type: "Point",
            coordinates: [-101.679, 21.126]
        },
        createdAt: "2026-03-07T12:00:00.000Z",
        updatedAt: "2026-03-07T12:00:00.000Z"
    },
    {
        id: "PAR-005",
        name: "Estacionamiento Subterráneo Explanada Cívica",
        type: "subterraneo",
        status: "cerrado",
        description: "Estacionamiento subterráneo cerrado temporalmente por mantenimiento",
        capacity: 400,
        location: {
            type: "Point",
            coordinates: [-101.683, 21.1225]
        },
        createdAt: "2026-03-09T12:00:00.000Z",
        updatedAt: "2026-03-09T12:00:00.000Z"
    },
    {
        id: "PAR-006",
        name: "Estacionamiento Subterráneo Zona Financiera",
        type: "subterraneo",
        status: "lleno",
        description: "Estacionamiento subterráneo con ocupación completa entre semana",
        capacity: 600,
        location: {
            type: "Point",
            coordinates: [-101.698, 21.133]
        },
        createdAt: "2026-03-11T12:00:00.000Z",
        updatedAt: "2026-03-11T12:00:00.000Z"
    }
];

module.exports = parkings;
