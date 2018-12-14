import { Injectable } from '@angular/core';
import { angularMath } from 'angular-ts-math';
import * as Turf from '@turf/turf';
import { flatMap, exhaustMap, mergeMap, concatMap, switchMap, concatAll } from 'rxjs/operators';
import { Observable, of, from, concat } from 'rxjs';
import { MapService } from '../../core/services/index';

import { IAnalyseState } from '../states/index';
import { MomentService } from "../../core/services/moment.service";
import { Data, Results, ResultSurvey, ResultSpecies, ResultStation, ResultZone, ResultPlatform, Method, DimensionsAnalyse, ResultStock, Year } from '../models/index';
import { Country, VESSEL, AREA } from '../../countries/models/country';
import { Species, Platform, Survey, Mesure, Count, Station, Zone, LegalDimensions } from '../../datas/models/index';


@Injectable()
export class SelectService {
    results: Results;
    data: Data;
    stationsZones: any;

    constructor(private ms: MomentService) {
    }

    setYearsAvailables(platforms: Platform[]): Observable<Year[]> {
        let years: Year[] = [];
        if (!platforms) return of(years);
        for (let p of platforms) {
            for (let s of p.surveys) {
                if (s.counts.length > 0) {
                    let y = new Date(s.dateStart).getFullYear();
                    if (years.map(ye => ye.year).indexOf(y) < 0) {
                        years.push({year: y, startDate: new Date(y,0,1), endDate: new Date(y,11,31)});
                    }
                }
            }
        }
        return of(years.sort());
    }

    setSurveysAvailables(platforms: Platform[], years: Year[]) : Observable<Survey[]> {
        let surveys: Survey[] = [];
        if (!platforms || !years) return of(surveys);
        for (let s of (<any>platforms).flatMap(p => p.surveys)) {
            let sd = new Date(s.dateStart);
            let ysd = years.filter(year => year.year === sd.getFullYear());
            let ed = new Date(s.dateEnd);
            let yed = years.filter(year => year.year === ed.getFullYear());
            if (s.counts.length > 0 && (ysd && ysd.length > 0 && ysd[0].startDate <= sd && ysd[0].endDate >= sd) && (yed && yed.length > 0 && yed[0].startDate <= ed && yed[0].endDate >= ed)) {
                surveys = [...surveys, s];
            }
        }
        return of(surveys);
    }

    setZonesAvailables(platforms: Platform[], surveys: Survey[]) : Observable<Zone[]> {
        let zones: Zone[] = [];
        if (!platforms || !surveys) return of(zones);
        console.log("setZonesAvailables start "+new Date());
        for (let survey of surveys.filter(s => s.counts.length > 0)) {
            for (let station of (<any>platforms.map(p => p.stations)).flatMap(stations => stations).filter((station: Station) => survey.counts.map(c => c.codeStation).indexOf(station.properties.code) >= 0)) {
                let sz = (<any>platforms.map(p => p.zones)).flatMap(zones => zones).filter((zone: Zone) => zone.codePlatform === station.codePlatform && MapService.booleanInPolygon(station, MapService.getPolygon(zone, { name: zone.properties.name })));
                zones = [...zones, ...sz.filter(z => zones.indexOf(z) < 0)];
            }
        }
        console.log("setZonesAvailables end "+new Date());
        return of(zones);
    }

    setStationsAvailables(platforms: Platform[], zones: Zone[], surveys: Survey[]) : Observable<Station[]> {
        let stations = [];
        if (!platforms || !zones || !surveys) return of(stations);
        console.log("setStationsAvailables start "+new Date());
        for (let survey of surveys.filter(s => s.counts.length > 0)) {
            for (let station of (<any>platforms.map(p => p.stations)).flatMap(stations => stations).filter((station: Station) => survey.counts.map(c => c.codeStation).indexOf(station.properties.code) >= 0)) {
                if (zones.filter((zone: Zone) => MapService.booleanInPolygon(station, MapService.getPolygon(zone, { name: zone.properties.name }))).length > 0) {
                    stations = [...stations, station];
                }
            }
        }
        console.log("setStationsAvailables end "+new Date());
        return of(stations);
    }

    setSpeciesAvailables(speciesEntities: Species[], surveys: Survey[], stations: Station[]) : Observable<Species[]> {
        let species = [];
        if (!surveys || !speciesEntities) return of(species);
        for (let s of surveys) {
            for (let c of s.counts.filter(count => stations.map(station=> station.properties.code).indexOf(count.codeStation)>=0)) {
                if (c.mesures) {
                    for (let m of c.mesures) {
                        let cs = speciesEntities.filter(sp => sp.code === m.codeSpecies).filter(sp => species.filter(s => s.code === sp.code).length === 0);
                        species = [...species, ...cs];
                        if (species.length === speciesEntities.length) {
                            species.sort;
                            return of(species);
                        }
                    }
                }
                if (c.quantities) {
                    for (let q of c.quantities) {
                        let cs = speciesEntities.filter(sp => sp.code === q.codeSpecies).filter(sp => species.filter(s => s.code === sp.code).length === 0);
                        species = [...species, ...cs];
                        if (species.length === speciesEntities.length) {
                            species.sort;
                            return of(species);
                        }
                    }
                }
            }
        }
        return of(species.sort());
    }
}