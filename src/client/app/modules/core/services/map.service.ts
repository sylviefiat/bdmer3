import { Injectable } from '@angular/core';
import * as Turf from '@turf/turf';

@Injectable()
export class MapService {

    constructor() { }

    static getFeature(feature, properties) {
        switch (feature.geometry.type) {
            case "GeometryCollection":
                return Turf.multiPolygon(feature.geometry.geometries.map(geom => geom.coordinates), properties);
            case "MultiPolygon":
                return Turf.multiPolygon(feature.geometries.coordinates, properties);
            case "Polygon":
                return Turf.polygon(feature.geometry.coordinates, properties);
            case "Point":
                return Turf.point(feature.geometry.coordinates, properties)
            default:
                return null;
        }
    }

    static getPolygon(feature,properties) {
        switch (feature.geometry.type) {
            case "GeometryCollection":
                return Turf.multiPolygon(feature.geometry.geometries.map(geom => geom.coordinates), properties);
            case "MultiPolygon":
                 return Turf.multiPolygon(feature.geometries.coordinates, properties);
            default:
            case "Polygon":
                return Turf.polygon(feature.geometry.coordinates, properties);
        }
    }

}

