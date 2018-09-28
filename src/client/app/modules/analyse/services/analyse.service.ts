import { Injectable } from '@angular/core';
import { angularMath } from 'angular-ts-math';
import * as Turf from '@turf/turf';
import { flatMap, exhaustMap, mergeMap, concatMap } from 'rxjs/operators';
import { Observable, of, from, concat } from 'rxjs';
import { MapService } from '../../core/services/index';

import { IAnalyseState } from '../states/index';
import { Data, Results, ResultSurvey, ResultSpecies, ResultStation, ResultZone, ResultPlatform, Method, DimensionsAnalyse } from '../models/index';
import { Country } from '../../countries/models/country';
import { Species, Platform, Survey, Mesure, Count, Station, Zone, LegalDimensions } from '../../datas/models/index';

@Injectable()
export class AnalyseService {
    results: Results;
    data: Data;
    stationsZones: any;

    constructor() {
    }

    analyse(analyseData: Data): Observable<Results> {
        this.data = analyseData;
        console.log("get results ?");
        this.setStationsZones();
        console.log(this.stationsZones);
        return this.getResults();
    }

    setStationsZones(){
        this.stationsZones = [];
        let stations = this.data.usedStations;
        for(let zone of this.data.usedZones){
            this.stationsZones[zone.properties.code]=[];
            for(let st of stations){
                if(MapService.booleanInPolygon(st,MapService.getPolygon(zone,{}))){
                    this.stationsZones[zone.properties.code]=[...this.stationsZones[zone.properties.code],st.properties.code];
                    stations = [...stations.filter(s => s.properties.code !== st.properties.code)];
                }
            }
        }        
    }

    getResults() : Observable<Results> {
        console.log("get results ?");
        this.results = { name: "ANALYSE BDMER " + new Date(), resultPerSurvey: [] };
        return from(this.data.usedSurveys)
            .mergeMap((survey:Survey) => {console.log(survey);return this.getResultsSurvey(survey)})
            .mergeMap((rsurvey:ResultSurvey) => {
                console.log(rsurvey);
                this.results.resultPerSurvey.push(rsurvey);
                return of(this.results);
            });
        
    }

    getResultsSurvey(survey: Survey): Observable<ResultSurvey> {
        console.log(survey);
        let rsurvey : ResultSurvey = { codeSurvey: survey.code, yearSurvey: new Date(survey.dateStart).getFullYear(), codePlatform: survey.codePlatform, resultPerSpecies: [] };
        return from(this.data.usedSpecies.filter(sp => {console.log(this.hasSpSurvey(survey,sp));return this.hasSpSurvey(survey,sp);}))
            .mergeMap((species:Species) => {console.log(species);return this.getResultsSurveySpecies(survey,species);})
            .mergeMap((rspecies:ResultSpecies) => {
                console.log(rspecies);
                rsurvey.resultPerSpecies.push(rspecies);
                return of(rsurvey);
            });
    }

    hasSpSurvey(survey: Survey, species: Species): boolean {
        return survey.counts.filter((c: Count) => (c.quantities && c.quantities.length > 0 && c.quantities[0].codeSpecies === species.code)
            || (c.mesures && c.mesures.length > 0 && c.mesures.filter(m => m.codeSpecies === species.code).length > 0)).length > 0;
    }

    getResultsSurveySpecies(survey:Survey,species: Species) : Observable<ResultSpecies> {
        console.log("survey species");
        let rspecies: ResultSpecies = { codeSpecies: species.code, nameSpecies: species.scientificName, resultPerStation: [], resultPerZone: [], resultPerPlatform: [] };
        console.log(this.data.usedStations.filter(station =>this.hasStationSp(species,station,survey)));
        return from(this.data.usedStations.filter(station => this.hasStationSp(species,station,survey)))
                .pipe(
                    mergeMap((station: Station) => this.getResultStation(survey, species, station)
                    .map((rstation:ResultStation) => {
                        rspecies.resultPerStation.push(rstation);
                        return rspecies;
                    })),
            concatMap((rspecies: ResultSpecies) => 
                from(this.data.usedZones.filter(zone => this.hasZoneSp(species,zone,survey)))
                    .pipe(
                        mergeMap((zone:Zone) => this.getResultZone(survey,species,zone)
                        .map((rzone:ResultZone) => {
                        console.log(rzone);
                        //STOPPED HERE
                        rspecies.resultPerZone.push(rzone); 
                        return rspecies;
                    })))),
            concatMap((rspecies: ResultSpecies) => 
                from(this.data.usedPlatforms.filter(platform => this.hasPlatformSp(species,platform,survey)))
                    .pipe(
                        mergeMap(platform => this.getResultPlatform(survey,species,platform)
                        .map(rplatform => {
                            console.log(rplatform);
                            rspecies.resultPerPlatform.push(rplatform);
                            return rspecies;
                        }
                    ))))
        )
    }

    hasStationSp(species: Species, station: Station, survey: Survey): boolean {
        return this.hasStationSpCode(species,station.properties.code,survey);
    }

    hasStationSpCode(species: Species, codeStation: string, survey: Survey): boolean {
        for(let c of survey.counts.filter(c => c.codeStation ===codeStation)){
            if(c.quantities && c.quantities.length > 0 && c.quantities[0].codeSpecies === species.code){
                return true;
            }
            if(c.mesures && c.mesures.length > 0 && c.mesures.map(m => m.codeSpecies).indexOf(species.code)>=0){
                return true;
            }
        }
            return false;
    }

    hasZoneSp(species: Species, zone: Zone, survey: Survey): boolean {
        for(let codeStation of this.stationsZones[zone.properties.code]){
            if(this.hasStationSpCode(species,codeStation,survey)){
                console.log(true);
                return true;
            }
        }
        return false;
    }

    hasPlatformSp(species: Species, platform: Platform, survey: Survey){
        for(let zone of this.data.usedZones.filter(z => z.codePlatform === platform.code)){
            if(this.hasZoneSp(species,zone,survey)){
                return true;
            }
        }
        return false;
     }

    getResultStation(survey: Survey, species: Species, station: Station): Observable<ResultStation> {
        console.log(station);
        let rstation : ResultStation = { codeStation: station.properties.code, surface: survey.surfaceStation, abundance: 0, biomasses: [], biomass: 0, biomassPerHA: 0, abundancePerHA: 0};        
        let cmesures:any = survey.counts.filter(c => c.codeStation === station.properties.code);
        console.log(cmesures);
        let mesures = cmesures.flatMap(c => c.mesures).filter(m => this.isInDims(m,species));
        console.log(cmesures.flatMap(c => c.mesures));
        console.log(cmesures.flatMap(c => c.quantities));
        let quantities = cmesures.flatMap(c => c.quantities).map(q => q.quantity);
        console.log(quantities);
        let quantity = this.getSum(quantities);
        console.log(quantity);
        if (mesures.length === 0 && quantity ===0) {
            return of(rstation);
        }
        // ABONDANCE STATION = SOMME DES INDIVIDUS CONSIDERES
        rstation.abundance = mesures.length !==0 ? mesures.length : Number(quantity);
        console.log(rstation);
        // ABONDANCE PER HECTARE STATION = ABONDANCE STATION x (10000 / SURFACE STATION)
        rstation.abundancePerHA = Number(rstation.abundance) * (10000 / Number(rstation.surface));
        // Pas de relation taille/poids = pas de calcul biomasse
        if (this.data.usedMethod.method !== 'NONE') {
            console.log(mesures);
            for (let mesure of mesures) {
                rstation.biomasses.push(this.getBiomass(this.data.usedMethod, mesure, species));
            }
            // BIOMASSE STATION = SOMME DES BIOMMASSES DES INDIVIDUS CONSIDERES
            rstation.biomass = this.getSum(rstation.biomasses);
            // BIOMASSE PER HECTARE STATION = BIOMASSE STATION x (10000 / SURFACE STATION)
            rstation.biomassPerHA = rstation.biomass * (10000 / rstation.surface);
        }
        console.log(rstation);
        return of(rstation);
    }

    isInDims(mesure: Mesure, species:Species){
        let requiredDims = this.data.usedDims.filter(dims => dims.codeSp === species.code)[0];
        return mesure.codeSpecies === species.code
                && ((requiredDims.longMin === 0 || mesure.long >= requiredDims.longMin) && (requiredDims.longMax === 0 || mesure.long <= requiredDims.longMax));
    }

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
        console.log(biom);
        return biom;
    }

    getResultZone(survey: Survey, species:Species, zone: Zone): Observable<ResultZone> {
        let rzone : ResultZone = { codeZone: zone.properties.code, codePlatform: zone.codePlatform, surface: Number(zone.properties.surface), nbStrates: 0, nbStations: 0, averageAbundance: 0, abundance: 0, averageBiomass: 0,
            biomass: 0, biomassPerHA: 0, abundancePerHA: 0, SDBiomassPerHA: 0, SDabundancePerHA: 0 };
        let rstations = this.results.resultPerSurvey
            .filter(rsv => rsv.codeSurvey === survey.code)[0].resultPerSpecies
            .filter(rss => rss.codeSpecies === species.code)[0].resultPerStation
            .filter(rst => MapService.booleanInPolygon(this.data.usedStations.filter(st => st.properties.code === rst.codeStation)[0],MapService.getPolygon(zone,{})));
        rzone.nbStations = rstations.length;
        rzone.nbStrates = Number(zone.properties.surface) / this.getAverage(rstations.map(rs => rs.surface), rstations.length);
        rzone.averageAbundance = this.getAverage(rstations.map(rs => rs.abundance), rstations.length);
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
        console.log(rzone);
        return of(rzone);
    }

    getResultPlatform(survey,species,platform): Observable<ResultPlatform> {
        // Valeur approximative de la statistique de student pour un échantillon de plus de 30 stations
        const T: number = 2.05;
        let rplatform : ResultPlatform = {
            codePlatform: platform.code,
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
        let rzones = this.results.resultPerSurvey.filter(rs => rs.codeSurvey === survey.code)[0].resultPerSpecies.filter(rs => rs.codeSpecies === species.code)[0].resultPerZone.filter(rz => rz.codePlatform === platform.code);
        rplatform.nbStrates = this.getSum(rzones.map(rz => rz.nbStrates));
        rplatform.nbZones = rzones.length;
        rplatform.nbStations = this.getSum(rzones.map(rz => rz.nbStations));
        rplatform.averageAbundance = this.getAverage(rzones.map(rz => rz.nbStrates * rz.averageAbundance),rplatform.nbStrates);
        rplatform.varianceAbundance = this.getSum(rzones.map(rz => this.getPlatformZoneForVariance(rz.nbStrates, rz.SDabundancePerHA, rz.nbStations))) / angularMath.powerOfNumber(rplatform.nbStrates, 2);
        rplatform.confidenceIntervalAbundance = angularMath.squareOfNumber(rplatform.varianceAbundance) * T;
        // si calcul biomasse
        if (this.data.usedMethod.method !== 'NONE') {
            rplatform.averageBiomass = this.getAverage(rzones.map(rz => rz.nbStrates * rz.averageBiomass),rplatform.nbStrates);
            rplatform.varianceBiomass = this.getSum(rzones.map(rz => this.getPlatformZoneForVariance(rz.nbStrates, rz.SDBiomassPerHA, rz.nbStations))) / angularMath.powerOfNumber(rplatform.nbStrates, 2);
            rplatform.confidenceIntervalBiomass = angularMath.squareOfNumber(rplatform.varianceBiomass) * T;
        }
        console.log(rplatform);
        return of(rplatform);
    }

    getAverage(values: any[], nb: number): number {
        return values.reduce((a, b) => Number(a) + Number(b)) / Number(nb);
    }

    getSum(values: any[]): number {
        return values ? (values.length >1 ? values.reduce((a, b) => Number(a) + Number(b)) : values) : 0;
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
