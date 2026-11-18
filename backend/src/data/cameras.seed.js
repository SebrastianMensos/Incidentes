"use strict";

const cameras = [
    {
        id: "CAM-001",
        name: "Cámara Plaza Principal",
        type: "fija",
        status: "activa",
        description: "Cámara fija que monitorea el flujo de personas en la plaza principal",
        rangeMeters: 80,
        location: {
            type: "Point",
            coordinates: [-101.6826, 21.1221]
        },
        createdAt: "2026-04-01T12:00:00.000Z",
        updatedAt: "2026-04-01T12:00:00.000Z"
    },
    {
        id: "CAM-002",
        name: "Cámara Arco de la Calzada",
        type: "ptz",
        status: "activa",
        description: "Cámara PTZ con giro y zoom para vigilancia de la zona turística",
        rangeMeters: 300,
        location: {
            type: "Point",
            coordinates: [-101.682, 21.1275]
        },
        createdAt: "2026-04-03T12:00:00.000Z",
        updatedAt: "2026-04-03T12:00:00.000Z"
    },
    {
        id: "CAM-003",
        name: "Cámara Templo Expiatorio",
        type: "ptz",
        status: "falla",
        description: "Cámara PTZ fuera de servicio por falla en el motor de giro",
        rangeMeters: 250,
        location: {
            type: "Point",
            coordinates: [-101.6869, 21.1244]
        },
        createdAt: "2026-04-05T12:00:00.000Z",
        updatedAt: "2026-04-05T12:00:00.000Z"
    },
    {
        id: "CAM-004",
        name: "Cámara Lectora Blvd. López Mateos",
        type: "lectora_placas",
        status: "activa",
        description: "Lectora de placas instalada en un acceso vehicular de alto tráfico",
        rangeMeters: 150,
        location: {
            type: "Point",
            coordinates: [-101.67, 21.118]
        },
        createdAt: "2026-04-07T12:00:00.000Z",
        updatedAt: "2026-04-07T12:00:00.000Z"
    },
    {
        id: "CAM-005",
        name: "Cámara Lectora Blvd. Torres Landa",
        type: "lectora_placas",
        status: "mantenimiento",
        description: "Lectora de placas en revisión técnica y calibración",
        rangeMeters: 200,
        location: {
            type: "Point",
            coordinates: [-101.656, 21.131]
        },
        createdAt: "2026-04-09T12:00:00.000Z",
        updatedAt: "2026-04-09T12:00:00.000Z"
    },
    {
        id: "CAM-006",
        name: "Cámara Parque Metropolitano",
        type: "fija",
        status: "mantenimiento",
        description: "Cámara fija en mantenimiento preventivo dentro del parque",
        rangeMeters: 120,
        location: {
            type: "Point",
            coordinates: [-101.708, 21.133]
        },
        createdAt: "2026-04-11T12:00:00.000Z",
        updatedAt: "2026-04-11T12:00:00.000Z"
    }
];

module.exports = cameras;
