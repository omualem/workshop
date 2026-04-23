"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.haversineDistanceKm = void 0;
const EARTH_RADIUS_KM = 6371;
const toRadians = (degrees) => (degrees * Math.PI) / 180;
const haversineDistanceKm = (from, to) => {
    const dLat = toRadians(to.lat - from.lat);
    const dLng = toRadians(to.lng - from.lng);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(from.lat)) *
            Math.cos(toRadians(to.lat)) *
            Math.sin(dLng / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};
exports.haversineDistanceKm = haversineDistanceKm;
//# sourceMappingURL=distance.js.map