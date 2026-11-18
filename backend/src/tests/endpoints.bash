#!/usr/bin/env bash

# Run with: bash backend/src/tests/endpoints.bash [base_url]
# The API must already be running (npm start from the backend directory).

set -u

BASE_URL="${1:-${BASE_URL:-http://localhost:3000}}"
BASE_URL="${BASE_URL%/}"
PASS_COUNT=0
FAIL_COUNT=0
LAST_BODY=""

if ! command -v curl >/dev/null 2>&1; then
    printf 'ERROR: curl is required to run the endpoint tests.\n' >&2
    exit 2
fi

if ! curl --silent --show-error --fail "${BASE_URL}/api/health" >/dev/null; then
    printf 'ERROR: API is not responding at %s\n' "$BASE_URL" >&2
    printf 'Start it from the backend directory with: npm start\n' >&2
    exit 2
fi

print_body() {
    local body="$1"

    if [ -z "$body" ]; then
        printf '  (empty response)\n'
    elif command -v node >/dev/null 2>&1; then
        if ! printf '%s' "$body" | node -e '
            let input = "";
            process.stdin.setEncoding("utf8");
            process.stdin.on("data", chunk => input += chunk);
            process.stdin.on("end", () => {
                try {
                    console.log(JSON.stringify(JSON.parse(input), null, 2));
                } catch {
                    process.stdout.write(input + "\n");
                }
            });
        '; then
            printf '%s\n' "$body"
        fi
    else
        printf '%s\n' "$body"
    fi
}

request() {
    local label="$1"
    local method="$2"
    local path="$3"
    local expected_status="$4"
    local json_body="${5:-}"
    local response
    local curl_status
    local actual_status

    printf '\n--- %s: %s %s (esperado: %s) ---\n' \
        "$label" "$method" "$path" "$expected_status"

    if [ -n "$json_body" ]; then
        if response=$(curl --silent --show-error \
            --request "$method" \
            --header 'Content-Type: application/json' \
            --data "$json_body" \
            --write-out $'\n%{http_code}' \
            "${BASE_URL}${path}"); then
            curl_status=0
        else
            curl_status=$?
        fi
    else
        if response=$(curl --silent --show-error \
            --request "$method" \
            --write-out $'\n%{http_code}' \
            "${BASE_URL}${path}"); then
            curl_status=0
        else
            curl_status=$?
        fi
    fi

    actual_status="${response##*$'\n'}"
    LAST_BODY="${response%$'\n'*}"

    if [ "$curl_status" -eq 0 ] && [ "$actual_status" = "$expected_status" ]; then
        printf 'RESULTADO: PASS (HTTP %s)\n' "$actual_status"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        printf 'RESULTADO: FAIL (HTTP %s; esperado %s; curl %s)\n' \
            "${actual_status:-sin respuesta}" "$expected_status" "$curl_status"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi

    print_body "$LAST_BODY"
}

extract_id() {
    printf '%s' "$1" | node -e '
        let input = "";
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", chunk => input += chunk);
        process.stdin.on("end", () => {
            try {
                process.stdout.write(JSON.parse(input).data.id || "");
            } catch {
                process.stdout.write("");
            }
        });
    '
}

extract_first_id() {
    printf '%s' "$1" | node -e '
        let input = "";
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", chunk => input += chunk);
        process.stdin.on("end", () => {
            try {
                process.stdout.write(JSON.parse(input).data[0].id || "");
            } catch {
                process.stdout.write("");
            }
        });
    '
}

test_crud_routes() {
    local label="$1"
    local path="$2"
    local create_body="$3"
    local update_body="$4"
    local patch_body="$5"
    local resource_id

    request "Crear ${label}" POST "$path" 201 "$create_body"
    resource_id="$(extract_id "$LAST_BODY")"

    if [ -n "$resource_id" ]; then
        request "Reemplazar ${label}" PUT "${path}/${resource_id}" 200 "$update_body"
        request "Actualizar parcialmente ${label}" PATCH "${path}/${resource_id}" 200 "$patch_body"
        request "Eliminar ${label}" DELETE "${path}/${resource_id}" 200
        request "Confirmar eliminación de ${label}" GET "${path}/${resource_id}" 404
    else
        printf '\n--- Pruebas CRUD de %s omitidas: no se obtuvo el ID ---\n' "$label"
        FAIL_COUNT=$((FAIL_COUNT + 4))
    fi
}

printf 'Probando API en %s\n' "$BASE_URL"

request 'Información de la API' GET '/' 200
request 'Estado de salud' GET '/api/health' 200

request 'Lista de incidentes' GET '/api/incidents' 200
incident_id="$(extract_first_id "$LAST_BODY")"
if [ -n "$incident_id" ]; then
    request 'Detalle de incidente' GET "/api/incidents/${incident_id}" 200
else
    printf '\n--- Prueba de detalle de incidente omitida: no hay registros ---\n'
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi
request 'Filtro de incidentes' GET '/api/incidents?category=bache&status=pendiente' 200
request 'Incidentes GeoJSON' GET '/api/incidents/geojson' 200
test_crud_routes 'incidente' '/api/incidents' \
    '{"title":"Prueba automatizada de endpoint","category":"bache","description":"Incidente temporal creado por el script de pruebas","status":"pendiente","longitude":-101.6812,"latitude":21.1248}' \
    '{"title":"Incidente actualizado por prueba","category":"bache","description":"Actualizado por el script de pruebas","status":"pendiente","longitude":-101.6812,"latitude":21.1248}' \
    '{"status":"atendido"}'

request 'Lista de estaciones' GET '/api/stations' 200
station_id="$(extract_first_id "$LAST_BODY")"
if [ -n "$station_id" ]; then
    request 'Detalle de estación' GET "/api/stations/${station_id}" 200
else
    printf '\n--- Prueba de detalle de estación omitida: no hay registros ---\n'
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi
request 'Estaciones GeoJSON' GET '/api/stations/geojson' 200
test_crud_routes 'estación' '/api/stations' \
    '{"name":"Estación de prueba","type":"bomberos","status":"activa","description":"Prueba automatizada","units":2,"location":{"type":"Point","coordinates":[-101.68,21.12]}}' \
    '{"name":"Estación de prueba actualizada","type":"bomberos","status":"activa","description":"Actualización de prueba","units":3,"location":{"type":"Point","coordinates":[-101.68,21.12]}}' \
    '{"status":"inactiva"}'

request 'Lista de paradas de autobús' GET '/api/bus-stops' 200
bus_stop_id="$(extract_first_id "$LAST_BODY")"
if [ -n "$bus_stop_id" ]; then
    request 'Detalle de parada de autobús' GET "/api/bus-stops/${bus_stop_id}" 200
else
    printf '\n--- Prueba de detalle de parada omitida: no hay registros ---\n'
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi
request 'Paradas de autobús GeoJSON' GET '/api/bus-stops/geojson' 200
test_crud_routes 'parada de autobús' '/api/bus-stops' \
    '{"name":"Parada de prueba","type":"troncal","status":"operando","description":"Prueba automatizada","routesCount":3,"location":{"type":"Point","coordinates":[-101.68,21.12]}}' \
    '{"name":"Parada de prueba actualizada","type":"troncal","status":"operando","description":"Actualización de prueba","routesCount":4,"location":{"type":"Point","coordinates":[-101.68,21.12]}}' \
    '{"status":"suspendida"}'

request 'Lista de estacionamientos' GET '/api/parkings' 200
parking_id="$(extract_first_id "$LAST_BODY")"
if [ -n "$parking_id" ]; then
    request 'Detalle de estacionamiento' GET "/api/parkings/${parking_id}" 200
else
    printf '\n--- Prueba de detalle de estacionamiento omitida: no hay registros ---\n'
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi
request 'Estacionamientos GeoJSON' GET '/api/parkings/geojson' 200
test_crud_routes 'estacionamiento' '/api/parkings' \
    '{"name":"Estacionamiento de prueba","type":"superficie","status":"abierto","description":"Prueba automatizada","capacity":20,"location":{"type":"Point","coordinates":[-101.68,21.12]}}' \
    '{"name":"Estacionamiento de prueba actualizado","type":"superficie","status":"abierto","description":"Actualización de prueba","capacity":25,"location":{"type":"Point","coordinates":[-101.68,21.12]}}' \
    '{"status":"lleno"}'

request 'Lista de cámaras' GET '/api/cameras' 200
camera_id="$(extract_first_id "$LAST_BODY")"
if [ -n "$camera_id" ]; then
    request 'Detalle de cámara' GET "/api/cameras/${camera_id}" 200
else
    printf '\n--- Prueba de detalle de cámara omitida: no hay registros ---\n'
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi
request 'Cámaras GeoJSON' GET '/api/cameras/geojson' 200
test_crud_routes 'cámara' '/api/cameras' \
    '{"name":"Cámara de prueba","type":"fija","status":"activa","description":"Prueba automatizada","rangeMeters":50,"location":{"type":"Point","coordinates":[-101.68,21.12]}}' \
    '{"name":"Cámara de prueba actualizada","type":"fija","status":"activa","description":"Actualización de prueba","rangeMeters":60,"location":{"type":"Point","coordinates":[-101.68,21.12]}}' \
    '{"status":"mantenimiento"}'

printf '\n========== RESUMEN ==========\n'
printf 'Correctas: %s\n' "$PASS_COUNT"
printf 'Fallidas:  %s\n' "$FAIL_COUNT"
printf 'Total:     %s\n' "$((PASS_COUNT + FAIL_COUNT))"

if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
fi

exit 0