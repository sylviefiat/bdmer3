import { Injectable } from '@angular/core';
import * as Turf from '@turf/turf';
import { LngLatBounds, Layer, LngLat, MapMouseEvent, Map } from "mapbox-gl";

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

    static getPolygon(feature, properties) {
        switch (feature.geometry.type) {
            case "GeometryCollection":
                return Turf.multiPolygon(feature.geometry.geometries.map(geom => geom.coordinates), properties);
            case "MultiPolygon":
                return Turf.multiPolygon(feature.geometries.coordinates, properties);
            case "Polygon":
                return Turf.polygon(feature.geometry.coordinates, properties);
            default:
                return null;
        }
    }

    static getCoordinates(feature) {
        switch (feature.geometry.type) {
            case "GeometryCollection":
                return feature.geometry.geometries.flatMap(geom => geom.coordinates);
            case "MultiPolygon":
                return feature.geometry.geometries.flatMap(geom => geom.coordinates);
            case "Polygon":
            case "Point":
                return feature.geometry.coordinates;
            default:
                return null;
        }
    }

    static zoomToCountries(coordinates): LngLatBounds {
        return coordinates.reduce((bnd, coord) => {
            return bnd.extend(<any>coord);
        }, new LngLatBounds(coordinates[0], coordinates[0]));
    }

    static zoomToZones(featureCollection): LngLatBounds {
        var bnd = new LngLatBounds();
        var fc: Turf.FeatureCollection = featureCollection.features
            .filter(feature => feature && feature.geometry && feature.geometry.coordinates)
            .forEach((feature) => {
                try {
                    return bnd.extend(feature.geometry.type.indexOf('Multi') > -1 ? feature.geometry.coordinates[0][0] : feature.geometry.coordinates[0])
                } catch(e){
                    return bnd;
                }
            });
        return this.checkBounds(bnd);
    }

    static zoomToStations(featureCollection): LngLatBounds {
        var bnd = new LngLatBounds();
        var fc: Turf.FeatureCollection = featureCollection.features.forEach(feature => bnd.extend(feature.geometry.coordinates));
        return this.checkBounds(bnd);
    }

    static zoomOnZone(zone): LngLatBounds {
        var bnd = new LngLatBounds();
        this.getCoordinates(zone).forEach(polygon => {
            polygon.forEach(coord => {
                bnd.extend(coord);
            })
        });
        return this.checkBounds(bnd);
    }

    static zoomOnStation(station): LngLatBounds {
        var bnd = new LngLatBounds();
        bnd.extend(station.geometry.coordinates);
        return this.checkBounds(bnd);
    }


    static checkBounds(bounds: LngLatBounds): LngLatBounds {
        if (bounds.getNorthEast().lng < bounds.getSouthWest().lng) {
            let tmp = bounds.getSouthWest().lng;
            bounds.setSouthWest(new LngLat(bounds.getNorthEast().lng, bounds.getSouthWest().lat));
            bounds.setNorthEast(new LngLat(tmp, bounds.getNorthEast().lat));
        }
        if (bounds.getNorthEast().lat < bounds.getSouthWest().lat) {
            let tmp = bounds.getSouthWest().lat;
            bounds.setSouthWest(new LngLat(bounds.getSouthWest().lng, bounds.getNorthEast().lat));
            bounds.setNorthEast(new LngLat(bounds.getNorthEast().lng, tmp));
        }
        return bounds;
    }

    static booleanInPolygon(point,polygon){
        try {
            if(point && point.geometry && point.geometry.coordinates && point.geometry.coordinates[0] instanceof Number && point.geometry.coordinates[1] instanceof Number){
                return Turf.booleanPointInPolygon(point.geometry.coordinates, polygon);
            }
            return false;
        } catch(e){
            console.log(e);
            throw e;
            
        }
    }

}

