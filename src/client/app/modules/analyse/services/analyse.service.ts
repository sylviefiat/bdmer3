import { Injectable } from '@angular/core';
import { angularMath } from 'angular-ts-math';
import * as Turf from '@turf/turf';
import { MapService } from '../../core/services/index';

import { IAnalyseState } from '../states/index';
import { Data, Results, ResultSurvey, ResultSpecies, ResultStation, ResultZone, Indicators, Method, DimensionsAnalyse } from '../models/index';
import { Country } from '../../countries/models/country';
import { Species, Survey, Mesure, Count, Station, Zone } from '../../datas/models/index';

@Injectable()
export class AnalyseService {


    constructor() {
    }

    analyse(analyseData: Data): Results {
        console.log(analyseData);
        try {
            let result: Results = { name: "", resultPerSurvey: [] };
            let today = new Date();
            result.name = "ANALYSE BDMER " + today;
            // resultats par relevé
            for (let survey of analyseData.usedSurveys) {
                let surveyStations = analyseData.usedStations.filter(t => t.codePlatform === survey.codePlatform);
                let resultSurvey: ResultSurvey = { codeSurvey: survey.code, resultPerSpecies: [] };
                console.log(survey);
                // par espèce
                for (let sp of analyseData.usedSpecies) {
                    let resultSp: ResultSpecies = { codeSpecies: sp.code, numberIndividual: 0, biomassTotal: 0, biomassesPerStation: [], individualsPerStation: [], SDBiomassTotal: 0, SDAbundancyTotal: 0, resultPerStation: [], resultPerZone: [], legalDimensions: null };
                    resultSp.legalDimensions = sp.legalDimensions.filter(ld => ld.codeCountry === analyseData.usedCountry.code)[0];
                    console.log(sp);
                    // par station
                    for (let station of surveyStations) {
                        console.log(station);
                        // on récupère longueur et largeur min entrés par l'utilisateur pour cette espèce pour l'analyse
                        console.log(analyseData.usedDims);
                        let spdim = analyseData.usedDims.filter(spd => spd.codeSp === sp.code)[0];
                        console.log(spdim);
                        // on récupère la zone de la station  

                        let zone = analyseData.usedZones.filter((uz: Zone) => {
                            console.log(MapService.getPolygon(uz,{name: uz.properties.code}));
                            console.log(Turf.booleanPointInPolygon(station.geometry.coordinates, MapService.getPolygon(uz,{name: uz.properties.code})));
                            return station.geometry && uz.geometry && Turf.booleanPointInPolygon(station.geometry.coordinates, MapService.getPolygon(uz,{name: uz.properties.code}))
                        })[0];
                        // initialisation de resultZone au cas où cette zone n'ai pas encore été traitée
                        let resultZone: ResultZone = { codeZone: zone.properties.code, numberIndividual: 0, biomasses: [], biomassesPerHA: [], densitiesPerHA: [], biomassTotal: 0, biomassPerHA: 0, densityPerHA: 0, SDBiomassTotal: 0, SDBiomassPerHA: 0, SDDensityPerHA: 0 };
                        console.log(spdim);
                        // calcul des résultats pour ce station
                        let resultStation: ResultStation = this.getResultPerStation(survey, sp, spdim, station, analyseData.usedMethod);
                        console.log(resultStation);
                        // ajout des résultats du station dans le résultat de l'espère
                        resultSp.resultPerStation.push(resultStation);
                        console.log(resultZone);
                        // si la zone a déjà commencé a etre traitée on récupère l'objet de résultat
                        if (resultSp.resultPerZone.filter(rz => rz.codeZone === zone.properties.code) && resultSp.resultPerZone.filter(rz => rz.codeZone === zone.properties.code)[0]) {
                            resultZone = resultSp.resultPerZone.filter(rz => rz.codeZone === zone.properties.code)[0];
                        }
                        console.log(resultZone);
                        // mise à jour des résultats de la zone avec ce station
                        resultZone = this.updateResultPerZone(resultZone, zone, resultStation);
                        // on met a jour le résultat de la zone dans le résultat de l'espèce
                        resultSp.resultPerZone = [...resultSp.resultPerZone.filter(rz => rz.codeZone !== resultZone.codeZone), resultZone];
                        console.log(resultZone);
                        // on mets à jour les abondances et biomasses de l'espèce avec ce station
                        resultSp = this.updateResultPerSpecies(resultSp, resultStation);
                    }
                    console.log(resultSp);
                    // on ajoute le résultat de l'espèce au résultat du relevé
                    resultSurvey.resultPerSpecies.push(resultSp);
                }
                console.log(resultSurvey);
                // on ajoute le résultat du relevé au résultat global
                result.resultPerSurvey.push(resultSurvey);
            }
            return result;

        } catch (e) {
            console.log(e);
            throw e;
        }

    }

    getResultPerStation(survey: Survey, species: Species, spDim: DimensionsAnalyse, station: Station, method: Method): ResultStation {
        let x = 0, biom;
        let resultStation: ResultStation = { codeStation: station.properties.code, numberIndividual: 0, biomasses: [], biomassTotal: 0, biomassPerHA: 0, densityPerHA: 0, SDBiomassTotal: 0, SDDensityTotal: 0 };
        let mesures = [];
        for (let c of survey.counts.filter(c => c.codeStation === station.properties.code)) {
            mesures = [...mesures, ...c.mesures.filter(m => m.codeSpecies === species.code)];
        }
        for (let m of mesures) {
            // if specimen is in requested size otherwise don't consider it
            switch (method.method) {
                case "LONGUEUR":
                    if (Number(spDim.longMin) === 0 || Number(m.long) >= Number(spDim.longMin)) {
                        x = Number(m.long);
                    }
                    break;
                case "LONGLARG":
                default:
                    if ((Number(spDim.longMin) === 0 && Number(spDim.largMin) === 0) || (Number(m.long) >= Number(spDim.longMin) && Number(m.larg) >= Number(spDim.largMin))) {
                        x = (angularMath.getPi() * Number(m.long) * Number(m.larg)) / 4;
                    }
            }
            if (x > 0) {
                let biom = Number(species.LLW.coefA) * angularMath.powerOfNumber(x, Number(species.LLW.coefB));
                resultStation.biomasses.push(biom);
                resultStation.biomassTotal += biom;
            }
        }

        resultStation.numberIndividual = mesures.length;
        if (survey.surfaceStation > 0) {
            resultStation.biomassPerHA = resultStation.biomassTotal * (10000 / Number(survey.surfaceStation));
            resultStation.densityPerHA = resultStation.numberIndividual * (10000 / Number(survey.surfaceStation));
        }
        let inds = [];
        for (let i in mesures) { inds.push(1); }
        resultStation.SDBiomassTotal = this.standardDeviation(resultStation.biomasses);
        resultStation.SDDensityTotal = this.standardDeviation(inds);
        return resultStation;
    }

    updateResultPerZone(resultZone: ResultZone, zone: Zone, resultStation: ResultStation): ResultZone {
        resultZone.numberIndividual += resultStation.numberIndividual;
        resultZone.biomasses = [...resultZone.biomasses, ...resultStation.biomasses];
        resultZone.biomassesPerHA = [...resultZone.biomassesPerHA, resultStation.biomassPerHA];
        resultZone.densitiesPerHA = [...resultZone.densitiesPerHA, resultStation.densityPerHA];
        resultZone.biomassTotal += resultStation.biomassTotal;
        resultZone.biomassPerHA = resultZone.biomassTotal * (10000 / zone.properties.surface);
        resultZone.densityPerHA = resultZone.numberIndividual * (10000 / zone.properties.surface);
        resultZone.SDBiomassTotal = this.standardDeviation(resultZone.biomasses);
        resultZone.SDBiomassPerHA = this.standardDeviation(resultZone.biomassesPerHA);
        resultZone.SDDensityPerHA = this.standardDeviation(resultZone.densitiesPerHA);
        return resultZone;
    }

    updateResultPerSpecies(resultSp: ResultSpecies, resultStation: ResultStation): ResultSpecies {
        resultSp.numberIndividual += resultStation.numberIndividual;
        resultSp.biomassTotal += resultStation.biomassTotal;
        resultSp.biomassesPerStation = [...resultSp.biomassesPerStation, resultStation.biomassTotal];
        resultSp.individualsPerStation = [...resultSp.individualsPerStation, resultStation.numberIndividual];
        resultSp.SDBiomassTotal = this.standardDeviation(resultSp.biomassesPerStation);
        resultSp.SDAbundancyTotal = this.standardDeviation(resultSp.individualsPerStation);
        return resultSp;
    }

    standardDeviation(table: number[]) {
        if (table.length <= 0) return 0;
        let total = table.reduce((p, c) => p + c);
        let length = table.length;
        let mean = (total / length);
        let variance = table
            .map(value => Math.pow(value - mean, 2))
            .reduce((p, c) => p + c);
        return Math.sqrt(variance / (length - 1));
    }

    /*calculate_indicators(species: Species, mesures: Mesure[], method: Method): Indicators {
        let indicators: Indicators = {biomasses:[],biomass_total: 0, biomass_salt: 0,biomass_dry: 0,abundancy_calcul: 0, density_total_calcul_individual: 0, density_total_calcul_weight:0};
        let biomass = 0
        for(let i in mesures){
            // calcul biomass depending on method
            let x=(method.method ==="LONGLARG")?((angularMath.getPi()*Number(mesures[i].long)*Number(mesures[i].larg))/4):(Number(mesures[i].long));            
            // biomass per individual
            indicators.biomasses[i] = Number(species.LLW.coefA)*angularMath.powerOfNumber(x, Number(species.LLW.coefB));
            biomass += indicators.biomasses[i];
        }
        // species total biomass
        indicators.biomass_total = biomass/mesures.length;
        console.log(indicators);
        return indicators;
    }*/


    getTotalMesures(surveys: Survey[], spDims: DimensionsAnalyse[]): Mesure[] {
        let total_mesures: Mesure[] = [];
        for (let s of surveys) {
            for (let c of s.counts) {
                for (let m of c.mesures) {
                    let dims = spDims.filter(dims => dims.codeSp === m.codeSpecies)[0];
                    if (dims &&
                        ((Number(dims.longMin) > 0 && Number(dims.largMin) > 0 &&
                            Number(m.larg) <= Number(dims.largMin) && Number(m.long) <= Number(dims.longMin)) ||
                            (Number(dims.longMin) === 0 && Number(dims.largMin) === 0)))
                        total_mesures = [...total_mesures, m];
                }
            }
        }
        return total_mesures;
    }


}