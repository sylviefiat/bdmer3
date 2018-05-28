import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { angularMath } from 'angular-ts-math';

import { IAnalyseState } from '../states/index';
import { Data, Results, ResultSurvey, ResultSpecies, ResultTransect, ResultZone, Indicators, Method, DimensionsAnalyse } from '../models/index';
import { Country } from '../../countries/models/country';
import { Species, Survey, Mesure, Count, Transect, Zone } from '../../datas/models/index';

@Injectable()
export class AnalyseService {


    constructor() {
    }

    analyse(analyseData: Data): Results {
        let result: Results = { name: "", resultPerSurvey: [] };
        let today = new Date();
        result.name = "ANALYSE BDMER " + today;
        // resultats par relevé
        for (let survey of analyseData.usedSurveys) {
            let surveyTransects = analyseData.usedTransects.filter(t => t.codePlatform === survey.codePlatform);
            let resultSurvey: ResultSurvey = { codeSurvey: survey.code, resultPerSpecies: [] };
            // par espèce
            for (let sp of analyseData.usedSpecies) {
                let resultSp: ResultSpecies = { codeSpecies: sp.code, numberIndividual:0, biomassTotal:0, biomassesPerTransect:[], individualsPerTransect:[], SDBiomassTotal:0, SDAbundancyTotal:0, resultPerTransect: [], resultPerZone: [], legalDimensions:null};
                resultSp.legalDimensions=sp.legalDimensions.filter(ld => ld.codeCountry === analyseData.usedCountry.code)[0];
                // par transect
                for (let transect of surveyTransects) {
                    // on récupère longueur et largeur min entrés par l'utilisateur pour cette espèce pour l'analyse
                    let spdim = analyseData.usedDims.filter(spd => spd.codeSp===sp.code)[0]; 
                    // on récupère la zone du transect  
                    let zone = analyseData.usedZones.filter(uz => uz.properties.code === transect.codeZone)[0];                 
                    // initialisation de resultZone au cas où cette zone n'ai pas encore été traitée
                    let resultZone: ResultZone = { codeZone: zone.properties.code, numberIndividual: 0, biomasses: [], biomassesPerHA: [], densitiesPerHA: [], biomassTotal: 0, biomassPerHA: 0, densityPerHA: 0, SDBiomassTotal:0, SDBiomassPerHA:0, SDDensityPerHA:0 };
                    // calcul des résultats pour ce transect
                    let resultTransect: ResultTransect= this.getResultPerTransect(survey, sp, spdim, transect, analyseData.usedMethod);
                    // ajout des résultats du transect dans le résultat de l'espère
                    resultSp.resultPerTransect.push(resultTransect);
                    // si la zone a déjà commencé a etre traitée on récupère l'objet de résultat
                    if(resultSp.resultPerZone.filter(resultZone => resultZone.codeZone) && resultSp.resultPerZone.filter(resultZone => resultZone.codeZone)[0]){
                        resultZone = resultSp.resultPerZone.filter(resultZone => resultZone.codeZone)[0];
                    } 
                    // mise à jour des résultats de la zone avec ce transect
                    resultZone = this.updateResultPerZone(resultZone, zone, resultTransect);
                    // on met a jour le résultat de la zone dans le résultat de l'espèce
                    resultSp.resultPerZone=[...resultSp.resultPerZone.filter(rz => rz.codeZone !== resultZone.codeZone),resultZone];
                    // on mets à jour les abondances et biomasses de l'espèce avec ce transect
                    resultSp=this.updateResultPerSpecies(resultSp,resultTransect);
                }                
                // on ajoute le résultat de l'espèce au résultat du relevé
                resultSurvey.resultPerSpecies.push(resultSp);
            }

            // on ajoute le résultat du relevé au résultat global
            result.resultPerSurvey.push(resultSurvey);
        }
        console.log(result);
        return result;
    }

    getResultPerTransect(survey: Survey, species: Species, spDim: DimensionsAnalyse, transect: Transect, method: Method): ResultTransect {
        let x = 0, biom;
        let resultTransect: ResultTransect = { codeTransect: transect.properties.code, numberIndividual: 0, biomasses: [], biomassTotal: 0, biomassPerHA: 0, densityPerHA: 0 };
        let mesures = [];
        for (let c of survey.counts.filter(c => c.codeTransect === transect.properties.code)) {
            mesures = [...mesures, ...c.mesures.filter(m => m.codeSpecies === species.code)];
        }
        for (let m of mesures) {
            // if specimen is in requested size otherwise don't consider it
            switch(method.method){ 
                case "LONGUEUR":
                    if(Number(spDim.longMin)===0 || Number(m.long)>= Number(spDim.longMin)){
                        x = Number(m.long);
                    }
                    break;
                case "LONGLARG":
                default:
                    if((Number(spDim.longMin)===0&&Number(spDim.largMin)===0)||(Number(m.long)>= Number(spDim.longMin)&&Number(m.larg)>= Number(spDim.largMin))){
                        x = (angularMath.getPi() * Number(m.long) * Number(m.larg)) / 4;
                    }
            } 
            if(x > 0){
                let biom = Number(species.LLW.coefA) * angularMath.powerOfNumber(x, Number(species.LLW.coefB));
                resultTransect.biomasses.push(biom);
                resultTransect.biomassTotal += biom;
            }
        }
        
        resultTransect.numberIndividual = mesures.length;
        if(survey.surfaceTransect > 0){
            resultTransect.biomassPerHA = resultTransect.biomassTotal * (10000 / Number(survey.surfaceTransect));
            resultTransect.densityPerHA = resultTransect.numberIndividual * (10000 / Number(survey.surfaceTransect));
        }
        return resultTransect;
    }

    updateResultPerZone(resultZone: ResultZone, zone: Zone, resultTransect: ResultTransect): ResultZone{
        resultZone.numberIndividual += resultTransect.numberIndividual;
        resultZone.biomasses = [...resultZone.biomasses, ...resultTransect.biomasses];
        resultZone.biomassesPerHA = [...resultZone.biomassesPerHA, resultTransect.biomassPerHA];
        resultZone.densitiesPerHA = [...resultZone.densitiesPerHA, resultTransect.densityPerHA];
        resultZone.biomassTotal += resultTransect.biomassTotal;
        resultZone.biomassPerHA = resultZone.biomassTotal * (10000 / zone.properties.surface);
        resultZone.densityPerHA = resultZone.numberIndividual * (10000 / zone.properties.surface);
        resultZone.SDBiomassTotal = this.standardDeviation(resultZone.biomasses);
        resultZone.SDBiomassPerHA = this.standardDeviation(resultZone.biomassesPerHA);
        resultZone.SDDensityPerHA = this.standardDeviation(resultZone.densitiesPerHA);
        return resultZone;
    }

    updateResultPerSpecies(resultSp: ResultSpecies, resultTransect: ResultTransect): ResultSpecies{
        resultSp.numberIndividual += resultTransect.numberIndividual;
        resultSp.biomassTotal += resultTransect.biomassTotal;
        resultSp.biomassesPerTransect = [...resultSp.biomassesPerTransect, resultTransect.biomassTotal];
        resultSp.individualsPerTransect = [...resultSp.individualsPerTransect, resultTransect.numberIndividual];
        resultSp.SDBiomassTotal = this.standardDeviation(resultSp.biomassesPerTransect);
        resultSp.SDAbundancyTotal = this.standardDeviation(resultSp.individualsPerTransect);
        return resultSp;
    }

    standardDeviation(table: number[]){
        if(table.length<=0) return 0;
        let total = table.reduce((p,c) => p+c);
        let length = table.length;
        let mean = (total/length);
        let variance = table
            .map(value => Math.pow(value-mean,2))
            .reduce((p,c) => p+c);
        return Math.sqrt(variance/(length-1));
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