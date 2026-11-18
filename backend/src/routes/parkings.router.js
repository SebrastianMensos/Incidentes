"use strict";

const express = require("express");

const ParkingsService = require("../services/parkings.service");

const router = express.Router();
const service = new ParkingsService();

router.get("/", async (req, res) =>{
    const filters = {
        search: req.query.search,
        type: req.query.type,
        status: req.query.status
    };

    const items = await service.getAll(filters);

    res.status(200).json({
        count: items.length,
        data: items
    });
});

router.get("/geojson", async (req, res) =>{
    const filters = {
        search: req.query.search,
        type: req.query.type,
        status: req.query.status
    };

    const geoJSON = await service.getGeoJSON(filters);

    res.status(200).json(geoJSON);
});

router.get("/:id", async (req, res) =>{
    const {id} = req.params;

    const item = await service.getById(id);

    res.status(200).json({
        data: item
    });
});

router.get("/:status", async (req, res) =>{
    const {status} = req.params;

    const parkings = await service.getByStatus(status);

    res.status(200).json({
        count: parkings.length,
        data: parkings
    });
});

router.post("/", async (req, res) =>{
    const item = await service.create(req.body);

    res.status(201).json({
        message: "Parking created successfully",
        data: item
    });
});

router.put("/:id", async (req, res) =>{
    const item = await service.update(req.params.id, req.body);

    res.status(200).json({
        message: "Parking updated successfully",
        data: item
    });
});

router.patch("/:id", async (req, res) =>{
    const item = await service.patch(req.params.id, req.body);

    res.status(200).json({
        message: "Parking partially updated successfully",
        data: item
    });
});

router.delete("/:id", async (req, res) =>{
    const item = await service.delete(req.params.id);

    res.status(200).json({
        message: "Parking deleted successfully",
        data: item
    });
});

module.exports = router;
