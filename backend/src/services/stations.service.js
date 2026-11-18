"use strict";

const seedStations = require("../data/stations.seed");
const AppError = require("../utils/appError");
const { createRecord, updateRecord, deleteRecord } = require("../utils/resourceCrud");

class StationsService{
    constructor(){
        // se crea una copia de los datos iniciales
        // asi evitamos modificar directamente el archivo importado
        this.stations = structuredClone(seedStations);
    }

    async getAll(filters = {}){
        const{
            search = "",
            type = "all",
            status = "all"
        } = filters;

        let results = [...this.stations];

        const normalizedSearch = this.normalizeText(search);

        if(normalizedSearch){
            results = results.filter((item) =>{
                const searchableContent = this.normalizeText(
                    `${item.name} ${item.description} ${item.type}`
                );

                return searchableContent.includes(normalizedSearch);
            });
        }

        if(type !== "all"){
            results = results.filter(
                (item) => item.type === type
            );
        }

        if(status !== "all"){
            results = results.filter(
                (item) => item.status === status
            );
        }

        // los mas recientes aparecen primero
        results.sort(
            (first, second) =>
                new Date(second.createdAt) - new Date(first.createdAt)
        );

        return results;
    }

    // obtener por id
    async getById(id){
        const item = this.stations.find(
            (element) => element.id === id
        );

        if(!item){
            throw new AppError(
                404,
                `No se encontro la estacion de emergencia con el id ${id}`
            );
        }

        return item;
    }

    async getGeoJSON(filters = {}){
        const items = await this.getAll(filters);

        return{
            type: "FeatureCollection",
            features: items.map((item) => ({
                type: "Feature",
                properties: {
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    status: item.status,
                    description: item.description,
                    units: item.units,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                },
                geometry: item.location
            }))
        };
    }

    async create(data){
        if(!data || typeof data !== "object" || Array.isArray(data)){
            throw new AppError(400, "El cuerpo de la solicitud debe ser un objeto JSON.");
        }

        const requiredFields = ["name", "type", "status", "description"];
        const missingFields = requiredFields.filter(
            (field) => typeof data[field] !== "string" || !data[field].trim()
        );

        if(missingFields.length > 0){
            throw new AppError(
                400,
                `Faltan campos obligatorios: ${missingFields.join(", ")}`
            );
        }

        const units = data.units === undefined ? undefined : Number(data.units);
        if(units !== undefined && (!Number.isInteger(units) || units < 0)){
            throw new AppError(400, "El campo units debe ser un entero mayor o igual a cero.");
        }

        const hasLongitude = data.longitude !== undefined;
        const hasLatitude = data.latitude !== undefined;
        const hasLocation = data.location !== undefined;
        const coordinates = hasLocation
            ? data.location?.coordinates
            : hasLongitude && hasLatitude
                ? [data.longitude, data.latitude]
                : undefined;

        if(hasLongitude !== hasLatitude){
            throw new AppError(400, "Debe enviar longitude y latitude juntos.");
        }

        if(hasLocation || coordinates !== undefined){
            const [longitude, latitude] = coordinates || [];
            if(
                !Array.isArray(coordinates) ||
                coordinates.length !== 2 ||
                (hasLocation && data.location?.type !== "Point") ||
                !Number.isFinite(Number(longitude)) ||
                !Number.isFinite(Number(latitude)) ||
                Number(longitude) < -180 ||
                Number(longitude) > 180 ||
                Number(latitude) < -90 ||
                Number(latitude) > 90
            ){
                throw new AppError(400, "location debe ser un Point con coordenadas [longitude, latitude] válidas.");
            }
        }

        const stationData = {
            ...data,
            ...(units === undefined ? {} : { units }),
            ...(coordinates ? {
                location: {
                    type: "Point",
                    coordinates: coordinates.map(Number)
                }
            } : {})
        };
        delete stationData.longitude;
        delete stationData.latitude;

        return createRecord(this.stations, "STA", stationData);
    }

    async update(id, data){
        return updateRecord(this.stations, id, data, "la estacion de emergencia", false);
    }

    async patch(id, data){
        return updateRecord(this.stations, id, data, "la estacion de emergencia", true);
    }

    async delete(id){
        return deleteRecord(this.stations, id, "la estacion de emergencia");
    }

    normalizeText(value){
        return String(value)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g,"")
            .trim();
    }
}

module.exports = StationsService;
