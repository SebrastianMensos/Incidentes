"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const RESOURCE_OPTIONS = require("../config/resource-options");
const {
  validateResourcePayload,
  validateResourceQuery,
} = require("../middlewares/resource.validator");
const {
  validateIncidentQuery,
} = require("../middlewares/incident.validator");

const stationValidation = {
  requiredFields: ["name", "type", "status", "description"],
  enumFields: {
    type: RESOURCE_OPTIONS.stations.types,
    status: RESOURCE_OPTIONS.stations.statuses,
  },
  numericFields: {
    units: { integer: true, min: 0 },
  },
  maxLengths: {
    name: 80,
    description: 500,
  },
};

function runMiddleware(middleware, req) {
  let nextCalled = false;
  let error;

  middleware(req, {}, (nextError) => {
    nextCalled = true;
    error = nextError;
  });

  return { nextCalled, error };
}

test("resource query validation continues when filters are valid", () => {
  const result = runMiddleware(validateResourceQuery(RESOURCE_OPTIONS.stations), {
    query: { type: "bomberos", status: "activa" },
  });

  assert.equal(result.nextCalled, true);
  assert.equal(result.error, undefined);
});

test("resource query validation rejects unsupported filters", () => {
  const result = runMiddleware(validateResourceQuery(RESOURCE_OPTIONS.stations), {
    query: { type: "inventada" },
  });

  assert.equal(result.nextCalled, true);
  assert.equal(result.error.statusCode, 400);
});

test("resource payload validation normalizes numeric values and coordinates", () => {
  const req = {
    body: {
      name: "Estación de prueba",
      type: "bomberos",
      status: "activa",
      description: "Descripción de prueba",
      units: "2",
      longitude: "-101.68",
      latitude: "21.12",
    },
  };
  const result = runMiddleware(validateResourcePayload(stationValidation), req);

  assert.equal(result.error, undefined);
  assert.equal(req.body.units, 2);
  assert.equal(req.body.longitude, -101.68);
  assert.equal(req.body.latitude, 21.12);
});

test("resource payload validation rejects latitude outside its geographic range", () => {
  const result = runMiddleware(
    validateResourcePayload(stationValidation),
    {
      body: {
        name: "Estación de prueba",
        type: "bomberos",
        status: "activa",
        description: "Descripción de prueba",
        latitude: 91,
        longitude: 0,
      },
    },
  );

  assert.equal(result.error.statusCode, 400);
});

test("incident query validation continues for valid filters", () => {
  const result = runMiddleware(validateIncidentQuery, {
    query: { category: "bache", status: "pendiente" },
  });

  assert.equal(result.nextCalled, true);
  assert.equal(result.error, undefined);
});

test("incident query validation rejects unsupported categories", () => {
  const result = runMiddleware(validateIncidentQuery, {
    query: { category: "inventada" },
  });

  assert.equal(result.error.statusCode, 400);
});
