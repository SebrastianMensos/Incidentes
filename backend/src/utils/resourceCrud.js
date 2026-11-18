"use strict";

const { randomUUID } = require("node:crypto");
const AppError = require("./appError");

function getEditableData(data = {}) {
    const fields = { ...data };
    delete fields.id;
    delete fields.createdAt;
    delete fields.updatedAt;
    delete fields.longitude;
    delete fields.latitude;
    return fields;
}

function getLocation(data, currentLocation, partial) {
    const { location, longitude, latitude } = data;
    const baseLocation = partial ? currentLocation : undefined;
    let coordinates = location?.coordinates
        ? [...location.coordinates]
        : [...(baseLocation?.coordinates || [])];

    if(longitude !== undefined){
        coordinates[0] = Number(longitude);
    }

    if(latitude !== undefined){
        coordinates[1] = Number(latitude);
    }

    if(!location && longitude === undefined && latitude === undefined){
        return partial ? currentLocation : undefined;
    }

    return {
        ...(baseLocation || {}),
        ...(location || {}),
        type: location?.type || baseLocation?.type || "Point",
        coordinates
    };
}

function createRecord(items, idPrefix, data = {}){
    const now = new Date().toISOString();
    const record = {
        ...getEditableData(data),
        id: `${idPrefix}-${randomUUID()}`,
        createdAt: now,
        updatedAt: now
    };
    const location = getLocation(data, undefined, false);

    if(location){
        record.location = location;
    }

    items.push(record);
    return record;
}

function updateRecord(items, id, data = {}, label, partial){
    const index = items.findIndex((item) => item.id === id);

    if(index === -1){
        throw new AppError(404, `No se encontro ${label} con el id ${id}`);
    }

    const current = items[index];
    const fields = getEditableData(data);
    const location = getLocation(data, current.location, partial);
    const updated = {
        ...(partial ? current : {}),
        ...fields,
        id: current.id,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString()
    };

    if(location){
        updated.location = location;
    } else {
        delete updated.location;
    }

    items[index] = updated;
    return updated;
}

function deleteRecord(items, id, label){
    const index = items.findIndex((item) => item.id === id);

    if(index === -1){
        throw new AppError(404, `No se encontro ${label} con el id ${id}`);
    }

    return items.splice(index, 1)[0];
}

module.exports = {
    createRecord,
    updateRecord,
    deleteRecord
};
