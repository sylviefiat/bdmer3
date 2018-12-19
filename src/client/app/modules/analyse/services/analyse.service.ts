import { Injectable } from '@angular/core';
import { angularMath } from 'angular-ts-math';
import * as Turf from '@turf/turf';
import { flatMap, exhaustMap, mergeMap, concatMap, switchMap, concatAll } from 'rxjs/operators';
import { Observable, of, from, concat } from 'rxjs';
import { MapService } from '../../core/services/index';

import { IAnalyseState } from '../states/index';
import { MomentService } from "../../core/services/moment.service";
import { Data, Results, ResultSurvey, ResultSpecies, ResultStation, ResultZone, ResultPlatform, Method, DimensionsAnalyse, ResultStock } from '../models/index';
import { Country, VESSEL, AREA } from '../../countries/models/country';
import { Species, Platform, Survey, Mesure, Count, Station, Zone, LegalDimensions } from '../../datas/models/index';


@Injectable()
export class AnalyseService {
    results: Results;
    data: Data;
    stationsZonesPerPlatform: any;
    stationsZonesStock: any;

    constructor(private ms: MomentService) {
    }

    analyse(analyseData: Data): Observable<Results> {
        this.data = analyseData;
        console.log("analyse start " + new Date());
        this.setStationsZones();
        return this.getResults();
    }

    setStationsZones() {
        this.stationsZonesPerPlatform = [];
        this.stationsZonesStock = [];
        let stations = this.data.usedStations;
        for (let zone of this.data.usedZones) {
            this.stationsZonesPerPlatform[zone.properties.code] = [];
            this.stationsZonesStock[zone.properties.code] = [];
            for (let st of stations) {
                if( MapService.booleanInPolygon(st, MapService.getPolygon(zone, {}))) {
                    this.stationsZonesStock[zone.properties.code] = [...this.stationsZonesStock[zone.properties.code], st.properties.code];
                    if(st.codePlatform === zone.codePlatform){
                        this.stationsZonesPerPlatform[zone.properties.code] = [...this.stationsZonesPerPlatform[zone.properties.code], st.properties.code];
                    }
                    stations = [...stations.filter(s => s.properties.code !== st.properties.code)];
                }
            }
        }
    }

    getResults(): Observable<Results> {
        let day = this.ms.moment(new Date()).format("YYYY-MM-DD");
        this.results = { name: "ANALYSE BDMER3 " + day, resultPerSurvey: [] };
        if (this.data.usedCountry.platformType === VESSEL) {
            this.results.resultAll = [];
        }
        let resultsObs = of(this.results)
            .pipe(
                mergeMap((results: Results) => from(this.data.usedSurveys)
                    .pipe(
                        mergeMap((survey: Survey) => this.getResultsSurvey(survey)),
                        mergeMap((rsurvey: ResultSurvey) => {
                            this.results.resultPerSurvey.push(rsurvey);
                            return of(this.results);
                        })))
            )
            .subscribe();
        if (this.data.usedCountry.platformType === VESSEL) {
            let rstockObs = of(this.results).pipe(mergeMap((results: Results) => this.getResultStock())).subscribe();
        }
        console.log("analyse stop " + new Date());
        return of(this.results);
    }

    getResultsSurvey(survey: Survey): Observable<ResultSurvey> {
        let rsurvey: ResultSurvey = { codeSurvey: survey.code, yearSurvey: new Date(survey.dateStart).getFullYear(), codePlatform: survey.codePlatform, resultPerSpecies: [] };
        
        let speciesObs = of(rsurvey)
            .pipe(
                mergeMap((rsurvey: ResultSurvey) => from(this.data.usedSpecies.filter(sp => this.hasSpSurvey(survey, sp)))
                    .pipe(
                        mergeMap((species: Species) => this.getResultsSurveySpecies(survey, species)),
                        mergeMap((rspecies: ResultSpecies) => {
                            rsurvey.resultPerSpecies.push(rspecies);
                            return of(rsurvey);
                        }))))
            .subscribe();
        return of(rsurvey);
    }

    getResultStock(): Observable<Results> {
        let speciesObs = of(this.results)
            .pipe(
                mergeMap((results: Results) => from(this.data.usedSpecies)
                    .pipe(
                        mergeMap((species: Species) => this.getResultStockSpecies(species, results)),
                        mergeMap((rspecies: ResultSpecies) => {
                            this.results.resultAll.push(rspecies);
                            return of(this.results);
                        })
                    )
                )
            ).subscribe();
        return of(this.results);
    }

    getResultStockSpecies(species: Species, results: Results): Observable<ResultSpecies> {
        let rsp2: ResultSpecies = { codeSpecies: species.code, nameSpecies: species.scientificName, resultPerStation: [], resultPerZone: [], resultPerPlatform: [] };
        let rZonesStock : ResultZone[] = [];
        let stationsObs = of(this.results)
            .pipe(
                mergeMap((results: Results) => {
                    let rstations = [];
                    results.resultPerSurvey.forEach(rs => {
                        if (rs.resultPerSpecies.filter(rsp => rsp.codeSpecies === species.code)[0]) {
                            rstations = [...rstations, ...rs.resultPerSpecies.filter(rsp => rsp.codeSpecies === species.code)[0].resultPerStation];
                        }
                    });
                    rsp2.resultPerStation = [...rsp2.resultPerStation, ...rstations];
                    return of(results);
                })
            )
            .subscribe();
        let zonesObsPlatform = from(this.data.usedZones.filter(zone => this.stationsZonesPerPlatform[zone.properties.code] !== undefined && this.stationsZonesPerPlatform[zone.properties.code].length > 0))
            .pipe(
                mergeMap((zone: Zone) => this.getResultZone(rsp2.resultPerStation.filter(rps => this.stationsZonesPerPlatform[zone.properties.code].indexOf(rps.codeStation) >= 0), zone)),
                mergeMap((rzone: ResultZone) => {
                    if(rzone !== null){
                        rsp2.resultPerZone.push(rzone);
                    }
                    return of(rzone);
                })
            )
            .subscribe();
        let zonesObsStock = from(this.data.usedZones.filter(zone => this.stationsZonesStock[zone.properties.code] !== undefined && this.stationsZonesStock[zone.properties.code].length > 0))
            .pipe(
                mergeMap((zone: Zone) => this.getResultZone(rsp2.resultPerStation.filter(rps => this.stationsZonesStock[zone.properties.code].indexOf(rps.codeStation) >= 0), zone)),
                mergeMap((rzone: ResultZone) => {
                    if(rzone !== null){
                        rZonesStock.push(rzone);
                    }
                    return of(rzone);
                })
            )
            .subscribe();
        let stockObs = of(this.results)
            .pipe(
                mergeMap((results: Results) => this.getResultPlatform(rZonesStock)),
                mergeMap((rplatform: ResultPlatform) => {
                    if(rplatform !== null){
                        rsp2.resultPerPlatform.push(rplatform);
                    }
                    return of(rplatform);
                })
            )
            .subscribe();
        let platformObs = from(this.data.usedPlatforms)
            .pipe(
                mergeMap((platform: Platform) => {
                    return this.getResultPlatform(rsp2.resultPerZone.filter(rpz => rpz.codePlatform === platform.code), platform)
                }),
                mergeMap((rplatform: ResultPlatform) => {
                    if(rplatform !== null){
                        rsp2.resultPerPlatform.push(rplatform);
                    }
                    return of(rplatform);
                })
            )
            .subscribe();
        return of(rsp2);
    }

    hasSpSurvey(survey: Survey, species: Species): boolean {
        return survey.counts.filter((c: Count) => (c.quantities && c.quantities.length > 0 && c.quantities[0].codeSpecies === species.code)
            || (c.mesures && c.mesures.length > 0 && c.mesures.filter(m => m.codeSpecies === species.code).length > 0)).length > 0;
    }

    getResultsSurveySpecies(survey: Survey, species: Species): Observable<ResultSpecies> {
        let rspecies: ResultSpecies = { codeSpecies: species.code, nameSpecies: species.scientificName, resultPerStation: [], resultPerZone: [], resultPerPlatform: [] };

        let stationObs = of(rspecies)
            .pipe(
                mergeMap((rspecies: ResultSpecies) => from(this.data.usedStations.filter(station => this.stationInSurvey(station, survey)))
                    .pipe(
                        mergeMap((station: Station) => this.getResultStation(survey, species, station)),
                        mergeMap((rstation: ResultStation) => {
                            if (rstation !== null) {
                                rspecies.resultPerStation.push(rstation);
                            }
                            return of(rspecies);
                        }))))
            .subscribe();
        let zoneObs = of(rspecies)
            .pipe(
                mergeMap((rspecies: ResultSpecies) => from(this.data.usedZones.filter(zone => this.zoneHasStationsInSurvey(zone, survey)))
                    .pipe(
                        mergeMap((zone: Zone) => this.getResultZone(rspecies.resultPerStation.filter(rps => this.stationsZonesPerPlatform[zone.properties.code].indexOf(rps.codeStation) >= 0), zone)),
                        mergeMap((rzone: ResultZone) => {
                            if(rzone !== null){
                                rspecies.resultPerZone.push(rzone);
                            }
                            return of(rspecies);
                        }))))
            .subscribe();
        let platformObs = of(rspecies)
            .pipe(
                mergeMap((rspecies: ResultSpecies) => from(this.data.usedPlatforms.filter(platform => this.platformOfZones(platform, survey)))
                    .pipe(
                        mergeMap((platform: Platform) => this.getResultPlatform(rspecies.resultPerZone.filter(rpz => rpz.codePlatform === platform.code), platform)),
                        mergeMap((rplatform: ResultPlatform) => {
                            if(rplatform !== null){
                                rspecies.resultPerPlatform = [...rspecies.resultPerPlatform, rplatform];
                            }
                            return of(rspecies);
                        }
                        ))))
            .subscribe();
        return of(rspecies);

    }

    stationInSurvey(station: Station, survey: Survey): boolean {
        return this.codeStationInSurvey(station.properties.code, survey);
    }

    codeStationInSurvey(codeStation: string, survey: Survey): boolean {
        return survey.counts.filter(count => count.codeStation === codeStation).length > 0;
    }

    zoneHasStationsInSurvey(zone: Zone, survey: Survey): boolean {
        for (let codeStation of this.stationsZonesPerPlatform[zone.properties.code]) {
            if (this.codeStationInSurvey(codeStation, survey)) {
                return true;
            }
        }
        return false;
    }

    platformOfZones(platform: Platform, survey: Survey) {
        for (let zone of this.data.usedZones.filter(z => z.codePlatform === platform.code)) {
            if (this.zoneHasStationsInSurvey(zone, survey)) {
                return true;
            }
        }
        return false;
    }

    getResultStation(survey: Survey, species: Species, station: Station): Observable<ResultStation> {        
        let rstation: ResultStation = {
            codeStation: station.properties.code, latitude: station.geometry.coordinates[1], longitude: station.geometry.coordinates[0], surface: survey.surfaceStation,
            nbCatches: 0, nbDivers: 0, abundance: 0, densityPerHA: 0
        };
        let counts: any = survey.counts.filter(c => c.codeStation === station.properties.code);
        let mesures = counts.flatMap(c => c.mesures.filter(m => m.codeSpecies === species.code));
        let quantities = counts.flatMap(c => c.quantities.filter(q => q && q.codeSpecies === species.code));
        let density = quantities.length > 0 ? this.getSum(quantities.map(q => q.density)) : 0;
        let nbCatches = quantities.length > 0 ? this.getSum(quantities.map(q => q.catches)) : 0;

        if (mesures.length === 0 && density === 0) {
            return of(rstation);
        }
        rstation.nbDivers = this.getAverage(counts.map(c => c.numberDivers));
        rstation.nbCatches = mesures.length !== 0 ? mesures.length : Number(nbCatches);

        // ABONDANCE STATION = SOMME DES INDIVIDUS CONSIDERES
        rstation.abundance = mesures.length !== 0 ? mesures.filter(m => this.isInDims(m, species)).length : Number(density);
        if (this.hasLegalDims(species) && mesures.length !== 0) {
            rstation.abundanceLegal = mesures.filter(m => this.isInLegalDims(m, species)).length
        }
        // ABONDANCE PER HECTARE STATION = ABONDANCE STATION x (10000 / SURFACE STATION)
        rstation.densityPerHA = Number(rstation.abundance) * (10000 / Number(rstation.surface));
        // Pas de relation taille/poids = pas de calcul biomasse
        if (this.data.usedMethod.method !== 'NONE' && mesures.length !== 0) {
            let biomasses = mesures.filter(m => this.isInDims(m, species)).map(m => this.getBiomass(this.data.usedMethod, m, species));
            // BIOMASSE STATION = SOMME DES BIOMMASSES DES INDIVIDUS CONSIDERES            
            rstation.biomass = this.getSum(biomasses);
            // SI TAILLE LEGALE POUR L'ESPECE DU PAYS EXISTE ON CALCULE LA BIOMASSE LEGALE
            if (this.hasLegalDims(species)) {
                let biomassesLegal = mesures.filter(m => this.isInLegalDims(m, species)).map(m => this.getBiomass(this.data.usedMethod, m, species));
                rstation.biomassLegal = this.getSum(biomassesLegal);
            }
            // BIOMASSE PER HECTARE STATION = BIOMASSE STATION x (10000 / SURFACE STATION)
            rstation.biomassPerHA = rstation.biomass * (10000 / rstation.surface);
        }
        return of(rstation);
    }

    isInDims(mesure: Mesure, species: Species) {
        let requiredDims = this.data.usedDims.filter(dims => dims.codeSp === species.code)[0];
        return mesure.codeSpecies === species.code
            && ((requiredDims.longMin === 0 || mesure.long >= requiredDims.longMin) && (requiredDims.longMax === 0 || mesure.long <= requiredDims.longMax));
    }

    hasLegalDims(species) {
        return species.legalDimensions.filter(ld => ld.codeCountry === this.data.usedCountry.code).length > 0;
    }

    isInLegalDims(mesure: Mesure, species: Species) {
        if (this.hasLegalDims(species)) {
            let legalDims = species.legalDimensions.filter(ld => ld.codeCountry === this.data.usedCountry.code)[0];
            return mesure.codeSpecies === species.code &&
                ((legalDims.longMin === 0 || mesure.long >= legalDims.longMin) && (legalDims.longMax === 0 || mesure.long <= legalDims.longMax));
        } else {
            return 1;
        }
    }

    // biomasse en grammes depuis des mesures en cm
    getBiomass(method: Method, mesure: Mesure, species: Species): number {
        let biom = 0;
        switch (method.method) {
            // Poids individuel(g) Longueur-Weight: LW = sp.LW.Coef_A x m.long ^ sp.LW.Coef_B
            case "LONGUEUR":
                biom = Number(species.LW.coefA) * angularMath.powerOfNumber(Number(mesure.long), Number(species.LW.coefB));
                break;
            // Poids individuel(g) Longueur-Largeur-Weight LLW = sp.LLW.Coef_A x (pi x (m.long/10)/2 x (m.larg/10)/2)^sp.LLW.Coef_B
            case "LONGLARG":
            default:
                biom = Number(species.LLW.coefA) * angularMath.powerOfNumber((angularMath.getPi() * (Number(mesure.long) * Number(mesure.larg) / 4)), Number(species.LLW.coefB));
                break;
        }
        return biom;
    }

    getResultZone(rstations: ResultStation[], zone: Zone): Observable<ResultZone> {
        let rzone: ResultZone = {
            codeZone: zone.properties.code, codePlatform: zone.codePlatform, surface: Number(zone.properties.surface), nbStrates: 0, nbStations: 0,
            nbCatches: 0, fishingEffort: 0, ratioNstSurface: 0, averageAbundance: 0, abundance: 0,
            abundancePerHA: 0, SDabundancePerHA: 0
        };
        rzone.nbStations = rstations.length;
        if (rstations.length <= 0) {
            return of(rzone);
        }
        rzone.ratioNstSurface = rzone.nbStations / (rzone.surface / 1000000);
        rzone.nbCatches = this.getSum(rstations.map(rs => rs.nbCatches));
        rzone.fishingEffort = this.getSum(rstations.map(rs => rs.nbDivers));       
        rzone.nbStrates = rstations.length > 0 ? Number(zone.properties.surface) / this.getAverage(rstations.map(rs => rs.surface)) : 0;
        rzone.averageAbundance = this.getAverage(rstations.map(rs => rs.abundance));
        rzone.abundance = Number(rzone.nbStrates) * Number(rzone.averageAbundance);
        rzone.abundancePerHA = Number(rzone.abundance) * 10000 / Number(rzone.surface);
        rzone.SDabundancePerHA = this.getStandardDeviation(rstations.map(rs => rs.densityPerHA));

        if (rstations[0].abundanceLegal) {
            rzone.averageAbundanceLegal = this.getAverage(rstations.map(rs => rs.abundanceLegal));
        }

        // si calcul biomasse
        if (this.data.usedMethod.method !== 'NONE') {
            rzone.averageBiomass = this.getAverage(rstations.map(rs => rs.biomass));
            rzone.biomass = Number(rzone.nbStrates) * Number(rzone.averageBiomass) / 1000;
            if (rstations.length > 0 && rstations[0].biomassLegal) {
                rzone.averageBiomassLegal = this.getAverage(rstations.map(rs => rs.biomassLegal));
            }
            rzone.biomassPerHA = Number(rzone.biomass) * (10000 / Number(rzone.surface));
            rzone.SDBiomassPerHA = this.getStandardDeviation(rstations.map(rs => rs.biomassPerHA));
        }
        return of(rzone);
    }

    getResultPlatform(rzones: ResultZone[], platform?: Platform): Observable<ResultPlatform> {
        // variable de student
        const T: number = 2.05;
        let rplatform: ResultPlatform = {
            codePlatform: platform ? platform.code : 'all',
            surface: 0,
            surfaceTotal: 0,
            nbZones: 0,
            nbZonesTotal: 0,
            nbStations: 0,
            nbStationsTotal: 0,
            nbCatches: 0,
            fishingEffort: 0
        };
        let varianceAbundance = 0;
        let varianceBiomass = 0;
        let nbStrates = 0;
        let averageAbundance = 0;
        let averageAbundanceLegal = 0;
        let confidenceIntervalAbundance = 0;
        let averageBiomass = 0;
        let averageBiomassLegal = 0;
        let confidenceIntervalBiomass = 0;
        if(rzones.length <= 0){
            return of(rplatform);
        }
        // stats globales        
        rplatform.nbZonesTotal = rzones.length;
        rplatform.surfaceTotal = this.getSum(rzones.map(rz => rz.surface));
        rplatform.nbStationsTotal = this.getSum(rzones.map(rz => rz.nbStations));
        rplatform.nbCatches = this.getSum(rzones.map(rz => rz.nbCatches));
        rplatform.fishingEffort = this.getSum(rzones.map(rs => rs.fishingEffort));
        // filter on zones taken in analysis (ie number of stations per ha is >0.2)
        rzones = rzones.filter(rz => rz.ratioNstSurface > 0.2);
        if (rzones.length > 0) {
            // platform
            rplatform.surface = this.getSum(rzones.map(rz => rz.surface));
            nbStrates = this.getSum(rzones.map(rz => rz.nbStrates));
            rplatform.nbZones = rzones.length;
            rplatform.nbStations = this.getSum(rzones.map(rz => rz.nbStations));

            averageAbundance = this.getSum(rzones.map(rz => rz.nbStrates * rz.averageAbundance)) / nbStrates;
            if (rzones.length > 0 && rzones[0].averageAbundanceLegal) {
                averageAbundanceLegal = this.getSum(rzones.map(rz => rz.nbStrates * rz.averageAbundanceLegal)) / nbStrates;
            }
            varianceAbundance = this.getSum(rzones.map(rz => this.getPlatformZoneForVariance(rz.nbStrates, rz.SDabundancePerHA, rz.nbStations))) / angularMath.powerOfNumber(nbStrates, 2);
            confidenceIntervalAbundance = angularMath.squareOfNumber(varianceAbundance) * T;
            // stock si platform type = site
            if (this.data.usedCountry.platformType === VESSEL) {
                rplatform.resultStock = { abundance: 0, abundanceCI: 0, abundanceCA: 0, densityPerHA: 0, densityCAPerHA: 0 };
                rplatform.resultStock.abundance = averageAbundance * nbStrates;
                rplatform.resultStock.abundanceCI = confidenceIntervalAbundance * nbStrates;
                rplatform.resultStock.abundanceCA = rplatform.resultStock.abundance - rplatform.resultStock.abundanceCI;
                rplatform.resultStock.densityPerHA = rplatform.resultStock.abundance / (rplatform.surface / 10000);
                rplatform.resultStock.densityCAPerHA = rplatform.resultStock.abundanceCA / (rplatform.surface / 10000);
                if (averageAbundanceLegal) {
                    rplatform.resultStock.abundanceLegal = averageAbundanceLegal * nbStrates;
                }
            }
            // si calcul biomasse
            if (this.data.usedMethod.method !== 'NONE') {
                // platform
                averageBiomass = this.getSum(rzones.map(rz => rz.nbStrates * rz.averageBiomass)) / nbStrates;
                varianceBiomass = this.getSum(rzones.map(rz => this.getPlatformZoneForVariance(rz.nbStrates, rz.SDBiomassPerHA, rz.nbStations))) / angularMath.powerOfNumber(nbStrates, 2);
                confidenceIntervalBiomass = angularMath.squareOfNumber(varianceBiomass) * T;
                if (rzones.length > 0 && rzones[0].averageBiomassLegal) {
                    averageBiomassLegal = this.getSum(rzones.map(rz => rz.nbStrates * rz.averageBiomassLegal)) / nbStrates;
                }
                // stock si platform type = site
                if (this.data.usedCountry.platformType === VESSEL) {
                    rplatform.resultStock.stock = averageBiomass * nbStrates;
                    rplatform.resultStock.stockCI = confidenceIntervalBiomass * nbStrates / 1000;
                    rplatform.resultStock.stockCA = rplatform.resultStock.stock - rplatform.resultStock.stockCI;
                    if (averageBiomassLegal) {
                        rplatform.resultStock.stockLegal = averageBiomassLegal * nbStrates;
                    }
                }
            }
        }
        // insert
        rplatform.nbStrates = nbStrates;
        //rplatform.s = averageAbundance;
        /*if(averageAbundanceLegal > 0){
            rplatform.averageAbundanceLegal = averageAbundanceLegal;
        }*/
        /*if(confidenceIntervalAbundance > 0){
            rplatform.confidenceIntervalAbundance = confidenceIntervalAbundance;
        }*/
        /*if(averageBiomass > 0){
            rplatform.averageBiomass = averageBiomass;
        }
        if(averageBiomassLegal > 0){
            rplatform.averageBiomassLegal = averageBiomassLegal;
        }*/
        /*if(confidenceIntervalBiomass>0){
            rplatform.confidenceIntervalBiomass = confidenceIntervalBiomass;
        }*/
        return of(rplatform);
    }

    getAverage(values: any[]): number {
        return values ? (values.length > 1 ? values.reduce((a, b) => Number(a) + Number(b)) / values.length : Number(values[0])) : 0;
    }

    getSum(values: any[]): number {
        return values ? (values.length > 1 ? values.reduce((a, b) => Number(a) + Number(b)) : values[0]) : 0;
    }

    getPlatformZoneForVariance(nbStrates, standardDeviation, nbStations): number {
        return angularMath.powerOfNumber(Number(nbStrates), 2) * angularMath.powerOfNumber(Number(standardDeviation), 2) * (1 - Number(nbStations) / Number(nbStrates)) / Number(nbStations);
    }

    getStandardDeviation(table: number[]) {
        let sum = table.reduce((sum, value) => sum + value, 0);
        let avg = sum / table.length;
        // diffs = table.map(value => (value-avg));
        let squareDiffs = table.map(value => (value - avg) * (value - avg));
        let sumSquareDiffs = squareDiffs.reduce((sum, value) => sum + value, 0);
        let avgSquareDiffs = sumSquareDiffs / squareDiffs.length;
        let stdDev = Math.sqrt(avgSquareDiffs);
        return stdDev;
    }

}
