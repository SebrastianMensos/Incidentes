"use strict";

const seedBusStops = require("../data/bus-stops.seed");
const AppError = require("../utils/appError");
const { createRecord, updateRecord, deleteRecord } = require("../utils/resourceCrud");

class BusStopsService{
    constructor(){
        // se crea una copia de los datos iniciales
        // asi evitamos modificar directamente el archivo importado
        this.busStops = structuredClone(seedBusStops);
    }

    async getAll(filters = {}){
        const{
            search = "",
            type = "all",
            status = "all"
        } = filters;

        let results = [...this.busStops];

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
        const item = this.busStops.find(
            (element) => element.id === id
        );

        if(!item){
            throw new AppError(
                404,
                `No se encontro la parada de transporte con el id ${id}`
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
                    routesCount: item.routesCount,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                },
                geometry: item.location
            }))
        };
    }

    async create(data){
        return createRecord(this.busStops, "BUS", data);
    }

    async update(id, data){
        return updateRecord(this.busStops, id, data, "la parada de transporte", false);
    }

    async patch(id, data){
        return updateRecord(this.busStops, id, data, "la parada de transporte", true);
    }

    async delete(id){
        return deleteRecord(this.busStops, id, "la parada de transporte");
    }

    normalizeText(value){
        return String(value)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g,"")
            .trim();
    }
}

module.exports = BusStopsService;
