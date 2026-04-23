export type LatLng = {
    lat: number;
    lng: number;
};
export declare const haversineDistanceKm: (from: LatLng, to: LatLng) => number;
