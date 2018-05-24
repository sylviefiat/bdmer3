import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { angularMath } from 'angular-ts-math';

import { IAnalyseState } from '../states/index';
import { Data, Results, ResultSurvey, ResultSpecies, ResultTransect, Indicators, Method, DimensionsAnalyse } from '../models/index';
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
                let resultSp: ResultSpecies = { codeSpecies: sp.code, resultPerTransect: [], indicators: [], interpretation: [], stock: [] };
                // par transect
                for (let transect of surveyTransects) {
                    let spdim = analyseData.usedDims.filter(spd => spd.codeSp===sp.code)[0];
                    resultSp.resultPerTransect.push(this.getResultPerTransect(survey, sp, spdim, transect, analyseData.usedMethod));
                }
                resultSurvey.resultPerSpecies.push(resultSp);
            }
            result.resultPerSurvey.push(resultSurvey);
        }

        let total_mesures: Mesure[] = this.getTotalMesures(analyseData.usedSurveys, analyseData.usedDims);
        //result.indicators=[];
        /*for (let species of analyseState.usedSpecies) {
            let mesures_sp = total_mesures.filter(m => m.codeSpecies === species.code);
            let ind = this.calculate_indicators(species, mesures_sp, analyseState.usedMethod);
            result.indicators.push(ind);
        }*/
        console.log(result);
        return result;
    }

    getResultPerTransect(survey: Survey, species: Species, spDim: DimensionsAnalyse, transect: Transect, method: Method): ResultTransect {
        let resultTransect: ResultTransect = { codeTransect: transect.code, numberIndividual: 0, biomasses: [], biomassTotal: 0, biomassPerHA: 0, densityPerHA: 0 };
        let mesures = [];
        for (let c of survey.counts.filter(c => c.codeTransect === transect.code)) {
            mesures = [...mesures, ...c.mesures.filter(m => m.codeSpecies === species.code)];
        }
        for (let m of mesures) {
            // if specimen is in requested size otherwise don't consider it
            console.log(spDim);
            if((Number(spDim.longMin)===0&&Number(spDim.largMin)===0)||(Number(m.long)>= Number(spDim.longMin)&&Number(m.larg)>= Number(spDim.largMin))){
                // calcul biomass depending on method
                let x = (method.method === "LONGLARG") ? ((angularMath.getPi() * Number(m.long) * Number(m.larg)) / 4) : (Number(m.long));
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