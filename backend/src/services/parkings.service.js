"use strict";

const seedParkings = require("../data/parkings.seed");
const AppError = require("../utils/appError");
const { createRecord, updateRecord, deleteRecord } = require("../utils/resourceCrud");

class ParkingsService{
    constructor(){
        // se crea una copia de los datos iniciales
        // asi evitamos modificar directamente el archivo importado
        this.parkings = structuredClone(seedParkings);
    }

    async getAll(filters = {}){
        const{
            search = "",
            type = "all",
            status = "all"
        } = filters;

        let results = [...this.parkings];

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
        const item = this.parkings.find(
            (element) => element.id === id
        );

        if(!item){
            throw new AppError(
                404,
                `No se encontro el estacionamiento publico con el id ${id}`
            );
        }

        return item;
    }

    async getByType(type){
        const parkings = this.parkings.filter(
            (item) => item.type === type
        );

        return parkings;
    }

    async getByStatus(status){
        const parkings = this.parkings.filter(
            (item) => item.status === status
        );

        return parkings;
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
                    capacity: item.capacity,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                },
                geometry: item.location
            }))
        };
    }

    async create(data){
        return createRecord(this.parkings, "PAR", data);
    }

    async update(id, data){
        return updateRecord(this.parkings, id, data, "el estacionamiento publico", false);
    }

    async patch(id, data){
        return updateRecord(this.parkings, id, data, "el estacionamiento publico", true);
    }

    async delete(id){
        return deleteRecord(this.parkings, id, "el estacionamiento publico");
    }

    normalizeText(value){
        return String(value)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g,"")
            .trim();
    }
}

module.exports = ParkingsService;
