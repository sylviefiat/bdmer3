import { Observable } from 'rxjs/Observable';

import { User, Country } from '../../countries/models/country';
import { Platform, Zone, Transect, Survey } from '../../datas/models/platform';
import { Method, Result, SurveySpecies } from '../models/analyse';
import { IAppState } from '../../ngrx/index';

export interface IAnalyseState {
    usedCountry: Country;
    usedPlatforms: Platform[];
    usedYears: string[];
    usedSurveys: Survey[];
    usedZones: Zone[];
    usedTransects: Transect[];
    usedSpecies: SurveySpecies[];
    methods: Method[],
    usedMethod: Method;
    analysing: boolean;
    analysed: boolean;
    result: Result;
    msg: string;
}

export const analyseInitialState: IAnalyseState = {
    usedCountry: null,
    usedPlatforms: null,
    usedYears: null,
    usedSurveys: null,
    usedZones: null,
    usedTransects: null,
    usedSpecies: null,
    methods: this.initMethods,
    usedMethod: null,
    analysing: false,
    analysed: false,
    result: null,
    msg: null
};

export const initMethods: Method[] = [
    { method: 'LONGLARG' },
    { method: 'LONGUEUR' }
]

export function getUsedCountry(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedCountry);
}

export function getUsedPlatforms(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedPlatforms);
}

export function getUsedYears(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedYears);
}

export function getUsedSurveys(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedSurveys);
}

export function getUsedZones(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedZones);
}

export function getUsedTransects(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedTransects);
}

export function getUsedSpecies(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedSpecies);
}

export function getMethods(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.methods);
}

export function getUsedMethod(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedMethod);
}

export function getAnalysing(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.analysing);
}

export function getAnalysed(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.analysed);
}

export function getResult(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.result);
}

export function getMsg(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.msg);
}

export function getYearsAvailables(state$: Observable<IAppState>) {
    return state$.select(state => {
        let years: string[] = [];
        if(state.analyse.usedPlatforms){
            for(let p of state.analyse.usedPlatforms){
                for(let s of p.surveys){
                    let y = new Date(s.dateStart).getFullYear().toString();
                    if(years.indexOf(y)<0){
                        years.push(y);
                    }
                }
            }
        }
        return years.sort();
    })
}

export function getSurveysAvailables(state$: Observable<IAppState>) {
    console.log(state$);
    return state$.select(state => {
        let surveys: Survey[] = [];
        if(state.analyse.usedPlatforms){
            for(let p of state.analyse.usedPlatforms){
                for(let s of p.surveys){
                    let surveyYear = new Date(s.dateStart).getFullYear().toString();
                    if(state.analyse.usedYears && state.analyse.usedYears.indexOf(surveyYear)>=0){
                        surveys.push(s);
                    }
                }
            }
        }
        return surveys;
    })
}

export function getZonesAvailables(state$: Observable<IAppState>) {
    //console.log(state$);
    return state$.select(state => {
        let zones = [];
        for (let i in state.analyse.usedSurveys) {
            zones[i] = state.platform.entities.filter(platform => platform.code === state.analyse.usedSurveys[i].codePlatform)[0].zones;
        }
        return zones;
    })
}

export function getTransectsAvailables(state$: Observable<IAppState>) {
    //console.log(state$);
    return state$.select(state => {
        let transects = [];
        for (let i in state.analyse.usedSurveys) {
            transects[i] = [];
            for (let zone of state.platform.entities.filter(platform => platform.code === state.analyse.usedSurveys[i].codePlatform)[0].zones) {
                transects[i] = [...transects[i], ...zone.transects];
            }
        }
        return transects;
    })
}