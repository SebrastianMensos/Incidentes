"use strict";

const incidents = [
    {
        id:"INC-001",
        title:"Bache frente a la universidad",
        category: "bache",
        description: "Bache profundo que dificulta el paso de vehiculos",
        status: "pendiente",
        location: {
            type: "Point",
            coordinates: [-101.6812, 21.1248]
        },
        createAt: "2026-01-15T12:00:00.000Z",
        updatedAt: "2026-01-15T12:00:00.000Z"
    },
    {
        id: "INC-002",
        title: "Luminaria sin funcionar",
        category: "alumbrado",
        description: "La calle permanece oscura durante las noches",
        status: "atendido",
        location: {
            type: "Point",
            coordinates: [-101.6751, 21.1195]
        },
        createAt: "2026-01-16T00:00:00.000Z",
        updatedAt: "2026-01-16T00:00:00.000Z"
    },
    {
        id: "INC-003",
        title: "Basura acumulada en parque",
        category: "basura",
        description: "Se reporta basura acumulada alrededor de los contenedores del parque",
        status: "atendido",
        location: {
            type: "Point",
            coordinates: [-101.6736, 21.1273]
        },
        createAt: "2026-01-16T00:00:00.000Z",
        updatedAt: "2026-01-16T00:00:00.000Z"
    },
    {
        id: "INC_004",
        title: "Fuga de agua potable",
        category: "fuga",
        description: "Tuberia aparentemente dañada provoca salida constante de agua sobre la calle",
        status: "pendiente",
        location: {
            type: "Point",
            coordinates: [-101.6697, 21.1149]
        },
        createAt: "2026-01-16T00:00:00.000Z",
        updatedAt: "2026-01-16T00:00:00.000Z"
    },
    {
        id: "INC_005",
        title: "Choque en crucero",
        category: "accidente",
        description: "Colision entre vehiculos registrada en un crucero con alta circulacion",
        status: "atendido",
        location: {
            type: "Point",
            coordinates: [-101.6845, 21.1231]
        },
        createAt: "2026-01-16T00:00:00.000Z",
        updatedAt: "2026-01-16T00:00:00.000Z"
        
    }
]

module.exports = incidents;