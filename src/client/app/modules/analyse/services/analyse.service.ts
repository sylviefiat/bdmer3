import { Injectable } from '@angular/core';
import { angularMath } from 'angular-ts-math';
import * as Turf from '@turf/turf';
import { flatMap } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';
import { MapService } from '../../core/services/index';

import { IAnalyseState } from '../states/index';
import { Data, Results, ResultSurvey, ResultSpecies, ResultStation, ResultZone, ResultPlatform, Method, DimensionsAnalyse } from '../models/index';
import { Country } from '../../countries/models/country';
import { Species, Platform, Survey, Mesure, Count, Station, Zone, LegalDimensions } from '../../datas/models/index';

@Injectable()
export class AnalyseService {
    results: Results;
    data: Data;
    stationsZones: [][];

    constructor() {
    }

    /*analyse1(analyseData: Data): Observable<Results> {
        console.log(analyseData);
        let results: Results = { name: null, resultPerSurvey: [] };
        results.name = "ANALYSE BDMER " + new Date();
        let resultsSurveys: ResultSurvey[] = [];
        for (let survey of analyseData.usedSurveys) {
            resultsSurveys = [...resultsSurveys, this.getResultsSurvey(analyseData, survey)];
        }
        results.resultPerSurvey = [...resultsSurveys.sort((a:ResultSurvey,b:ResultSurvey)=> a.codeSurvey >= b.codeSurvey ? Number(1):Number(-1))];
        return of(results);
    }*/

    analyse(analyseData: Data): Observable<Results> {
        this.data = analyseData;
        this.setStationsZones();
        return this.getResults();
    }

    setStationsZones(){
        let stations = this.data.usedStations;
        for(let zone of this.data.usedZones){
            this.stationsZones[zone.properties.code]=[];
            for(let st of stations){
                if(MapService.booleanInPolygon(st,zone)){
                    this.stationsZones[zone.properties.code].push(st.properties.code);
                    stations = [...stations.filter(s => s.properties.code !== st.properties.code)];
                }
            }
        }        
    }

    getResults() : Observable<Results> {
        this.results = { name: "ANALYSE BDMER " + new Date(), resultPerSurvey: [] };
        this.data.usedSurveys.map(survey => this.getResultsSurvey(survey)
            .subscribe(rsurvey => this.results.resultPerSurvey.push(rsurvey)));
        return of(this.results);
    }

   /* getResultsSurvey(survey: Survey): ResultSurvey {
        let rsurvey = { codeSurvey: null, yearSurvey: 0, codePlatform: null, resultPerSpecies: [] };
        let resultsSpecies: ResultSpecies[] = [];
        rsurvey.codeSurvey = survey.code;
        rsurvey.yearSurvey = new Date(survey.dateStart).getFullYear();
        rsurvey.codePlatform = survey.codePlatform;
        for (let species of analyseData.usedSpecies) {
            if (this.hasSpSurvey(survey, species)) {
                let requiredDims = analyseData.usedDims.filter(dims => dims.codeSp === species.code)[0];
                let rss = this.getResultsSurveySpecies(analyseData.usedMethod, analyseData.usedStations, analyseData.usedZones, analyseData.usedPlatforms, survey, species, requiredDims);
                resultsSpecies = [...resultsSpecies, rss];
            }
        }
        rsurvey.resultPerSpecies = [...resultsSpecies.sort((a:ResultSpecies,b:ResultSpecies)=> a.codeSpecies >= b.codeSpecies ? Number(1):Number(-1))];
        return rsurvey;
    }*/

    getResultsSurvey(survey: Survey): Observable<ResultSurvey> {
        let rsurvey : ResultSurvey = { codeSurvey: survey.code, yearSurvey: new Date(survey.dateStart).getFullYear(), codePlatform: survey.codePlatform, resultPerSpecies: [] };
        this.data.usedSpecies
            .filter(sp => this.hasSpSurvey(survey,sp))
            .map(species => this.getResultsSurveySpecies(survey,species)
            .subscribe(rspecies => this.results.resultPerSurvey
                .filter(rs => rs.codeSurvey === survey.code)[0].resultPerSpecies.push(rspecies)));
        return of(rsurvey);
        /*for (let species of analyseData.usedSpecies) {
            if (this.hasSpSurvey(survey, species)) {
                let requiredDims = analyseData.usedDims.filter(dims => dims.codeSp === species.code)[0];
                let rss = this.getResultsSurveySpecies(analyseData.usedMethod, analyseData.usedStations, analyseData.usedZones, analyseData.usedPlatforms, survey, species, requiredDims);
                resultsSpecies = [...resultsSpecies, rss];
            }
        }
        rsurvey.resultPerSpecies = [...resultsSpecies.sort((a:ResultSpecies,b:ResultSpecies)=> a.codeSpecies >= b.codeSpecies ? Number(1):Number(-1))];
        return rsurvey;*/
    }

    hasSpSurvey(survey: Survey, species: Species): boolean {
        return survey.counts.filter((c: Count) => (c.quantities && c.quantities.length > 0 && c.quantities[0].codeSpecies === species.code)
            || (c.mesures && c.mesures.length > 0 && c.mesures.filter(m => m.codeSpecies === species.code).length > 0)).length > 0;
    }

    getResultsSurveySpecies(survey:Survey,species: Species) : Observable<ResultSpecies> {
        let rspecies = { codeSpecies: species.code, nameSpecies: species.scientificName, resultPerStation: [], resultPerZone: [], resultPerPlatform: [] };
        from(this.data.usedStations
            .filter(station => this.hasStationSp(species,station,survey))
            .map(station => this.getResultStation(survey, species, station)
                .map(rstation => {
                    this.results.resultPerSurvey
                        .filter(rs => rs.codeSurvey === survey.code)[0].resultPerSpecies
                        .filter(rss => rss.codeSpecies === species.code)[0].resultPerStation.push(rstation);
                    return rstation;
                })))
        .mergeMap(() => 
            this.data.usedZones
                .filter(zone => this.hasZoneSp(species,zone,survey))
                .map(zone => this.getResultZone(survey,species,zone)
                    .map(rzone => {
                        this.results.resultPerSurvey
                            .filter(rs => rs.codeSurvey === survey.code)[0].resultPerSpecies
                            .filter(rss => rss.codeSpecies === species.code)[0].resultPerZone.push(rzone); 
                        return rzone;
                    })
                )
        )
        .subscribe(() => 
            this.data.usedPlatforms
                .filter(platform => this.hasPlatformSp(species,platform,survey))
                .map(platform => this.getResultPlatform(survey,species,platform)
                    .map(rplatform => 
                        this.results.resultPerSurvey
                        .filter(rs => rs.codeSurvey === survey.code)[0].resultPerSpecies
                        .filter(rss => rss.codeSpecies === species.code)[0].resultPerPlatform.push(rplatform)
                )
        ));
            
        return of(rspecies);
    }

    hasStationSp(species: Species, station: Station, survey: Survey): boolean {
        return survey.counts.filter((c:Count) => c.codeStation === station.properties.code).filter((c: Count) => (c.quantities && c.quantities.length > 0 && c.quantities[0].codeSpecies === species.code)
            || (c.mesures && c.mesures.length > 0 && c.mesures.filter(m => m.codeSpecies === species.code).length > 0)).length > 0;
    }

    hasZoneSp(species: Species, zone: Zone, survey: Survey): boolean {
        return this.results.resultPerSurvey
            .filter(rs => rs.codeSurvey === survey.code)[0].resultPerSpecies
            .filter(sp => sp.codeSpecies === species.code)[0].resultPerStation
            .filter(rs => this.stationsZones[zone.properties.code].indexOf(rs.codeStation)>=0).length >0;
    }

    hasPlatformSp(species: Species, platform: Platform, survey: Survey){
        return this.data.usedZones
            .filter(uz => this.results.resultPerSurvey
                .filter(rsv => rsv.codeSurvey === survey.code)[0].resultPerSpecies
                .filter(rss => rss.codeSpecies === species.code)[0].resultPerZone.map(rpz => rpz.codeZone).indexOf(uz.properties.code)).filter(z => z.codePlatform == platform.code).length > 0;
    }

   /* getResultsSurveySpecies(method: Method, usedStations: Station[], usedZones: Zone[], usedPlatforms: Platform[], survey: Survey, species: Species, requiredDims: DimensionsAnalyse): ResultSpecies {
        let rspecies = {
            codeSpecies: null,
            nameSpecies: null,
            resultPerStation: [],
            resultPerZone: [],
            resultPerPlatform: []
        };
        let resultsStations: ResultStation[] = [];
        let resultsZones: ResultZone[] = [];
        let resultsPlatforms: ResultPlatform[] = [];
        rspecies.codeSpecies = species.code;
        rspecies.nameSpecies = species.scientificName;
        for (let station of usedStations) {
            let rs = this.getResultStation(method, survey, station, species, requiredDims);
            resultsStations = [...resultsStations, rs];
        }
        rspecies.resultPerStation = [...resultsStations.sort((a:ResultStation,b:ResultStation)=> a.codeStation >= b.codeStation ? Number(1):Number(-1))];
        for (let zone of usedZones) {
            let rstZone = resultsStations.filter(rst => usedStations.filter(st => st.properties.code === rst.codeStation && 
                MapService.booleanInPolygon(st, MapService.getPolygon(zone,{name:zone.properties.name}))).length > 0);
            if (rstZone.length > 0) {
                let rz = this.getResultZone(method, survey, zone, rstZone);
                resultsZones = [...resultsZones, rz];
            }
        }
        rspecies.resultPerZone = [...resultsZones.sort((a:ResultZone,b:ResultZone)=> a.codeZone >= b.codeZone ? Number(1):Number(-1))];
        for (let platform of usedPlatforms) {
            let rznPlatform = resultsZones.filter(rzn => usedZones.filter(zn => zn.properties.code === rzn.codeZone && zn.codePlatform === platform.code).length > 0);
            if (rznPlatform.length > 0) {
                let rp = this.getResultPlatform(method, platform, rznPlatform);
                resultsPlatforms = [...resultsPlatforms, rp];
            }

        }
        rspecies.resultPerPlatform = [...resultsPlatforms.sort((a:ResultPlatform,b:ResultPlatform)=> a.codePlatform >= b.codePlatform ? Number(1):Number(-1))];
        return rspecies;
    }*/

    getResultStation(survey: Survey, species: Species, station: Station): Observable<ResultStation> {
        let rstation : ResultStation = { codeStation: station.properties.code, surface: survey.surfaceStation, abundance: 0, biomasses: [], biomass: 0, biomassPerHA: 0, abundancePerHA: 0};        
        let cmesures:any = survey.counts.filter(c => c.codeStation === station.properties.code);
        let mesures = cmesures.flatMap(c => c.mesures).filter(m => this.isInDims(m,species));
        let quantity = this.getSum(cmesures.flatMap(c => c.quantities).filter(q => q.quantity));
        if (mesures.length === 0 && quantity ===0) {
            return of(rstation);
        }
        // ABONDANCE STATION = SOMME DES INDIVIDUS CONSIDERES
        rstation.abundance = mesures.length !==0 ? mesures.length : Number(quantity);
        // ABONDANCE PER HECTARE STATION = ABONDANCE STATION x (10000 / SURFACE STATION)
        rstation.abundancePerHA = Number(rstation.abundance) * (10000 / Number(rstation.surface));
        // Pas de relation taille/poids = pas de calcul biomasse
        if (this.data.usedMethod.method !== 'NONE') {
            for (let mesure of mesures) {
                rstation.biomasses.push(this.getBiomass(this.data.usedMethod, mesure, species));
            }
            // BIOMASSE STATION = SOMME DES BIOMMASSES DES INDIVIDUS CONSIDERES
            rstation.biomass = this.getSum(rstation.biomasses);
            // BIOMASSE PER HECTARE STATION = BIOMASSE STATION x (10000 / SURFACE STATION)
            rstation.biomassPerHA = rstation.biomass * (10000 / rstation.surface);
        }
        return of(rstation);
    }

    isInDims(mesure: Mesure, species:Species){
        let requiredDims = this.data.usedDims.filter(dims => dims.codeSp === species.code)[0];
        return mesure.codeSpecies === species.code
                && ((requiredDims.longMin === 0 || mesure.long >= requiredDims.longMin) && (requiredDims.longMax === 0 || mesure.long <= requiredDims.longMax));
    }

    /*getResultStation(method: Method, survey: Survey, station: Station, species: Species, requiredDims: DimensionsAnalyse): ResultStation {
        let rstation = {
            codeStation: null,
            surface: 0,
            abundance: 0,
            biomasses: [],
            biomass: 0,
            biomassPerHA: 0,
            abundancePerHA: 0
        };
        rstation.codeStation = station.properties.code;
        rstation.surface = survey.surfaceStation;

        // tableau des mesures considérées
        let mesures = [];
        let quantity = 0;
        for (let c of survey.counts.filter(c => c.codeStation === station.properties.code)) {
            // si la mesure est sur la bonne espèce et dans la taille considérée
            mesures = [...mesures, ...c.mesures.filter(m => m.codeSpecies === species.code
                && ((requiredDims.longMin === 0 || m.long >= requiredDims.longMin) && (requiredDims.longMax === 0 || m.long <= requiredDims.longMax)))];
            quantity = c.quantities && c.quantities.filter(q => q.codeSpecies === species.code)[0]?c.quantities.filter(q => q.codeSpecies === species.code)[0].quantity:0;
        }
        if (mesures.length === 0 && quantity ===0) {
            return rstation;
        }
        // ABONDANCE STATION = SOMME DES INDIVIDUS CONSIDERES
        rstation.abundance = mesures.length !==0 ? mesures.length : Number(quantity);
        // ABONDANCE PER HECTARE STATION = ABONDANCE STATION x (10000 / SURFACE STATION)
        rstation.abundancePerHA = Number(rstation.abundance) * (10000 / Number(rstation.surface));
        // Pas de relation taille/poids = pas de calcul biomasse
        if (method.method !== 'NONE') {
            for (let mesure of mesures) {
                rstation.biomasses.push(this.getBiomass(method, mesure, species));
            }
            // BIOMASSE STATION = SOMME DES BIOMMASSES DES INDIVIDUS CONSIDERES
            rstation.biomass = this.getSum(rstation.biomasses);
            // BIOMASSE PER HECTARE STATION = BIOMASSE STATION x (10000 / SURFACE STATION)
            rstation.biomassPerHA = rstation.biomass * (10000 / rstation.surface);
        }
        return rstation;
    }*/

    getBiomass(method: Method, mesure: Mesure, species: Species): number {
        let biom = 0;
        switch (method.method) {
            // Poids individuel Longueur-Weight: LW = sp.LW.Coef_A x m.long ^ sp.LW.Coef_B
            case "LONGUEUR":
                biom = Number(species.LW.coefA) * angularMath.powerOfNumber(Number(mesure.long), Number(species.LW.coefB));
                break;
            // Poids individuel Longueur-Largeur-Weight LLW = sp.LLW.Coef_A x (pi x (m.long/10)/2 x (m.larg/10)/2)^sp.LLW.Coef_B
            case "LONGLARG":
            default:
                biom = Number(species.LLW.coefA) * angularMath.powerOfNumber((angularMath.getPi() * (Number(mesure.long) / 10) / 2 * (Number(mesure.larg) / 10) / 2), Number(species.LLW.coefB));
                break;
        }
        //console.log(biom);
        return biom;
    }

    getResultZone(survey: Survey, species:Species, zone: Zone): Observable<ResultZone> {
        let rzone = { codeZone: zone.properties.code, surface: Number(zone.properties.surface), nbStrates: 0, nbStations: 0, averageAbundance: 0, abundance: 0, averageBiomass: 0,
            biomass: 0, biomassPerHA: 0, abundancePerHA: 0, SDBiomassPerHA: 0, SDabundancePerHA: 0 };
        let rstations = this.results.resultPerSurvey
            .filter(rsv => rsv.codeSurvey === survey.code)[0].resultPerSpecies
            .filter(rss => rss.codeSpecies === species.code)[].resultPerStation
            .filter(rst => MapService.booleanInPolygon(this.data.usedStations.filter(st => st.properties.code === rst.codeStation)[0],zone));
        rzone.nbStations = rstations.length;
        rzone.nbStrates = Number(zone.properties.surface) / this.getAverage(rstations.map(rs => rs.surface), rstations.length);
        rzone.averageAbundance: this.getAverage(rstations.map(rs => rs.abundance), rstations.length)
        rzone.abundance = Number(rzone.nbStrates) * Number(rzone.averageAbundance);
        rzone.abundancePerHA = Number(rzone.abundance) * 10000 / Number(rzone.surface);
        rzone.SDabundancePerHA = this.getStandardDeviation(rstations.map(rs => rs.abundance));
        // si calcul biomasse
        if (this.data.usedMethod.method !== 'NONE') {
            rzone.averageBiomass = this.getAverage(rstations.map(rs => rs.biomass), rzone.nbStations);
            rzone.biomass = Number(rzone.nbStrates) * Number(rzone.averageBiomass) * 1000;
            rzone.biomassPerHA = Number(rzone.biomass) * (10000 / Number(rzone.surface));
            rzone.SDBiomassPerHA = this.getStandardDeviation(rstations.map(rs => rs.biomass));
        }
        //console.log(rzone);
        return of(rzone);
    }

    /*getResultZone(method: Method, survey: Survey, zone: Zone, rstations: ResultStation[]): ResultZone {
        let rzone = {
            codeZone: null,
            surface: 0,
            nbStrates: 0,
            nbStations: 0,
            averageAbundance: 0,
            abundance: 0,
            averageBiomass: 0,
            biomass: 0,
            biomassPerHA: 0,
            abundancePerHA: 0,
            SDBiomassPerHA: 0,
            SDabundancePerHA: 0
        };
        rzone.codeZone = zone.properties.code;
        rzone.surface = Number(zone.properties.surface);
        rzone.nbStations = rstations.length;
        rzone.nbStrates = Number(rzone.surface) / this.getAverage(rstations.map(rs => rs.surface), rzone.nbStations);
        rzone.averageAbundance = this.getAverage(rstations.map(rs => rs.abundance), rzone.nbStations);
        rzone.abundance = Number(rzone.nbStrates) * Number(rzone.averageAbundance);
        rzone.abundancePerHA = Number(rzone.abundance) * 10000 / Number(rzone.surface);
        rzone.SDabundancePerHA = this.getStandardDeviation(rstations.map(rs => rs.abundance));
        // si calcul biomasse
        if (method.method !== 'NONE') {
            rzone.averageBiomass = this.getAverage(rstations.map(rs => rs.biomass), rzone.nbStations);
            rzone.biomass = Number(rzone.nbStrates) * Number(rzone.averageBiomass) * 1000;
            rzone.biomassPerHA = Number(rzone.biomass) * (10000 / Number(rzone.surface));
            rzone.SDBiomassPerHA = this.getStandardDeviation(rstations.map(rs => rs.biomass));
        }
        //console.log(rzone);
        return rzone;
    }*/

    getResultPlatform(survey,species,platform): ResultPlatform {
        // Valeur approximative de la statistique de student pour un échantillon de plus de 30 stations
        const T: number = 2.05;
        let rplatform = {
            codePlatform: null,
            nbStrates: 0,
            nbZones: 0,
            nbStations: 0,
            averageAbundance: 0,
            averageBiomass: 0,
            varianceAbundance: 0,
            varianceBiomass: 0,
            confidenceIntervalAbundance: 0,
            confidenceIntervalBiomass: 0
        };
        rplatform.codePlatform = platform.code;
        rplatform.nbStrates = this.getSum(rzones.map(rz => rz.nbStrates));
        rplatform.nbZones = rzones.length;
        rplatform.nbStations = this.getSum(rzones.map(rz => rz.nbStations));
        rplatform.averageAbundance = this.getAverage(rzones.map(rz => rz.nbStrates * rz.averageAbundance),rplatform.nbStrates);
        rplatform.varianceAbundance = this.getSum(rzones.map(rz => this.getPlatformZoneForVariance(rz.nbStrates, rz.SDabundancePerHA, rz.nbStations))) / angularMath.powerOfNumber(rplatform.nbStrates, 2);
        rplatform.confidenceIntervalAbundance = angularMath.squareOfNumber(rplatform.varianceAbundance) * T;
        // si calcul biomasse
        if (method.method !== 'NONE') {
            rplatform.averageBiomass = this.getAverage(rzones.map(rz => rz.nbStrates * rz.averageBiomass),rplatform.nbStrates);
            rplatform.varianceBiomass = this.getSum(rzones.map(rz => this.getPlatformZoneForVariance(rz.nbStrates, rz.SDBiomassPerHA, rz.nbStations))) / angularMath.powerOfNumber(rplatform.nbStrates, 2);
            rplatform.confidenceIntervalBiomass = angularMath.squareOfNumber(rplatform.varianceBiomass) * T;
        }
        console.log(rplatform);
        return rplatform;
    }

    /*getResultPlatform(method: Method, platform: Platform, rzones: ResultZone[]): ResultPlatform {
        // Valeur approximative de la statistique de student pour un échantillon de plus de 30 stations
        const T: number = 2.05;
        let rplatform = {
            codePlatform: null,
            nbStrates: 0,
            nbZones: 0,
            nbStations: 0,
            averageAbundance: 0,
            averageBiomass: 0,
            varianceAbundance: 0,
            varianceBiomass: 0,
            confidenceIntervalAbundance: 0,
            confidenceIntervalBiomass: 0
        };
        rplatform.codePlatform = platform.code;
        rplatform.nbStrates = this.getSum(rzones.map(rz => rz.nbStrates));
        rplatform.nbZones = rzones.length;
        rplatform.nbStations = this.getSum(rzones.map(rz => rz.nbStations));
        rplatform.averageAbundance = this.getAverage(rzones.map(rz => rz.nbStrates * rz.averageAbundance),rplatform.nbStrates);
        rplatform.varianceAbundance = this.getSum(rzones.map(rz => this.getPlatformZoneForVariance(rz.nbStrates, rz.SDabundancePerHA, rz.nbStations))) / angularMath.powerOfNumber(rplatform.nbStrates, 2);
        rplatform.confidenceIntervalAbundance = angularMath.squareOfNumber(rplatform.varianceAbundance) * T;
        // si calcul biomasse
        if (method.method !== 'NONE') {
            rplatform.averageBiomass = this.getAverage(rzones.map(rz => rz.nbStrates * rz.averageBiomass),rplatform.nbStrates);
            rplatform.varianceBiomass = this.getSum(rzones.map(rz => this.getPlatformZoneForVariance(rz.nbStrates, rz.SDBiomassPerHA, rz.nbStations))) / angularMath.powerOfNumber(rplatform.nbStrates, 2);
            rplatform.confidenceIntervalBiomass = angularMath.squareOfNumber(rplatform.varianceBiomass) * T;
        }
        console.log(rplatform);
        return rplatform;
    }*/

    getAverage(values: any[], nb: number): number {
        return values.reduce((a, b) => Number(a) + Number(b)) / Number(nb);
    }

    getSum(values: any[]): number {
        return values.reduce((a, b) => Number(a) + Number(b));
    }

    getPlatformZoneForVariance(nbStrates, standardDeviation, nbStations): number {
        return angularMath.powerOfNumber(Number(nbStrates), 2) * angularMath.powerOfNumber(Number(standardDeviation), 2) * (1 - Number(nbStations) / Number(nbStrates));
    }

    getStandardDeviation(table: number[]) {
        if (table.length <= 1) return 0;
        let total = this.getSum(table);
        let length = table.length;
        let mean = (total / length);
        let variance = table
            .map(value => Math.pow(value - mean, 2))
            .reduce((p, c) => p + c);
        return Math.sqrt(variance / (length - 1));
    }





}
