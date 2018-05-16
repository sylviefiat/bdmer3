import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { angularMath } from 'angular-ts-math';

import { IAnalyseState } from '../states/index';
import { Results, ResultSurvey, ResultSpecies, ResultTransect, Indicators, Method } from '../models/index';
import { Country } from '../../countries/models/country';
import { Species, Survey, Mesure, Count, Transect, Zone } from '../../datas/models/index';

@Injectable()
export class AnalyseService {


    constructor() {
    }

    analyse(analyseState: IAnalyseState): Results {
        let result: Results = { name: "", resultPerSurvey: [] };
        result.name = "ANALYSE_BDMER_";
        // resultats par relevé
        for (let survey of analyseState.usedSurveys) {
            let surveyTransects = analyseState.usedTransects.filter(t => t.codePlatform === survey.codePlatform);
            let resultSurvey: ResultSurvey = { name: result.name + "_" + survey.code, resultPerSpecies: [] };
            for (let sp of analyseState.usedSpecies) {
                let resultSp: ResultSpecies = { name: resultSurvey.name + "_" + sp.code, resultPerTransect: [], indicators: [], interpretation: [], stock: [] };
                for (let transect of surveyTransects) {
                    resultSp.resultPerTransect.push(this.getResultPerTransect(survey, sp, transect, analyseState.usedMethod));
                }
                resultSurvey.resultPerSpecies.push(resultSp);
            }
            result.resultPerSurvey.push(resultSurvey);
        }

        let total_mesures: Mesure[] = this.getTotalMesures(analyseState.usedSurveys);
        //result.indicators=[];
        /*for (let species of analyseState.usedSpecies) {
            let mesures_sp = total_mesures.filter(m => m.codeSpecies === species.code);
            let ind = this.calculate_indicators(species, mesures_sp, analyseState.usedMethod);
            result.indicators.push(ind);
        }*/
        console.log(result);
        return result;
    }

    getResultPerTransect(survey: Survey, species: Species, transect: Transect, method: Method): ResultTransect {
        let resultTransect: ResultTransect = { codeTransect: transect.code, numberIndividual: 0, biomasses: [], biomassTotal: 0, biomassPerSquareMeter: 0, density: 0 };
        let mesures = [];
        for (let c of survey.counts) {
            mesures = [...mesures, ...c.mesures.filter(m => m.codeSpecies === species.code)];
        }
        for (let i in mesures) {
            // calcul biomass depending on method
            let x = (method.method === "LONGLARG") ? ((angularMath.getPi() * Number(mesures[i].long) * Number(mesures[i].larg)) / 4) : (Number(mesures[i].long));
            resultTransect.biomasses[i] = Number(species.LLW.coefA) * angularMath.powerOfNumber(x, Number(species.LLW.coefB));
            resultTransect.biomassTotal += resultTransect.biomasses[i];
        }
        resultTransect.numberIndividual = mesures.length;
        
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


    getTotalMesures(surveys: Survey[]): Mesure[] {
        let total_mesures: Mesure[] = [];
        for (let s of surveys) {
            for (let c of s.counts) {
                total_mesures = [...total_mesures, ...c.mesures];
            }
        }
        return total_mesures;
    }


}