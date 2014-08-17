
var GEOFENCE_ATTRIBUTES = [
    "uuid",
    "created",
    "offer_uuid",
    "radius",
    "latitude",
    "longitude"
];

function createGeofence(createGeofenceObj, successCB, errorCB) {
    createGeofenceObj.type = "geofence";
    postEntity(createGeofenceObj, successCB, errorCB);
}

function readGeofence(uuid, successCB, errorCB) {
    getEntity("eofence", uuid, GEOFENCE_ATTRIBUTES, successCB, errorCB);
}

function readMultipleGeofences(attribute, value, successCB, errorCB) {
    getEntities("geofence", attribute, value, GEOFENCE_ATTRIBUTES, successCB, errorCB);
}

function deleteGeofence(uuid, successCB, errorCB) {
    deleteEntity("geofence", uuid, successCB, errorCB);
}

function deleteGeofencesForOffer(uuid, successCB, errorCB) {
    deleteEntities("geofence", "offer_uuid", uuid, successCB, errorCB);
}

