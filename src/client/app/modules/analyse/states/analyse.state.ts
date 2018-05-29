import { Observable } from 'rxjs/Observable';
import * as Turf from '@turf/turf';

import { User, Country } from '../../countries/models/country';
import { Platform, Zone, Station, Survey, Species } from '../../datas/models/index';
import { Method, Results, Data, DimensionsAnalyse } from '../models/analyse';
import { IAppState } from '../../ngrx/index';

export interface IAnalyseState {
    usedCountry: Country;
    usedPlatforms: Platform[];
    usedYears: string[];
    usedSurveys: Survey[];
    usedZones: Zone[];
    usedStations: Station[];
    usedSpecies: Species[];
    usedDims: DimensionsAnalyse[];
    usedMethod: Method;
    analysing: boolean;
    analysed: boolean;
    result: Results;
    msg: string;
}

export const analyseInitialState: IAnalyseState = {
    usedCountry: null,
    usedPlatforms: null,
    usedYears: null,
    usedSurveys: null,
    usedZones: null,
    usedStations: null,
    usedSpecies: null,
    usedDims: null,
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

export function getUsedStations(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedStations);
}

export function getUsedSpecies(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedSpecies);
}

export function getUsedDims(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedDims);
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

export function getData(state$: Observable<IAnalyseState>): Observable<Data> {
    return state$.select(state => {
        return {
            usedCountry: state.usedCountry, 
            usedPlatforms: state.usedPlatforms, 
            usedYears: state.usedYears,
            usedSurveys: state.usedSurveys,
            usedZones: state.usedZones,
            usedStations: state.usedStations,
            usedSpecies: state.usedSpecies,
            usedDims: state.usedDims,
            usedMethod: state.usedMethod
        }
    });
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
    return state$.select(state => {
        let zones: Zone[] = [];
        for (let i in state.analyse.usedSurveys) {
            let sz: Zone[] = state.platform.entities.filter(platform => platform.code === state.analyse.usedSurveys[i].codePlatform)[0].zones;
            for(let z of sz){
                if(zones.indexOf(z)<0){
                    zones.push(z);
                }
            }           
        }
        return zones.sort();
    })
}

export function getStationsAvailables(state$: Observable<IAppState>) {
    return state$.select(state => {
        let stations = [];
        if(state.analyse.usedPlatforms && state.analyse.usedZones){
            for(let p of state.analyse.usedPlatforms){
                for(let s of p.stations){
                    for(let z of state.analyse.usedZones.filter(zone => zone.codePlatform===p.code)){
                        if(Turf.booleanPointInPolygon(s.geometry.coordinates,Turf.polygon(z.geometry.coordinates))) {
                            stations.push(s);
                        }
                    }
                }
            }
        }
        return stations.sort();
    })
}

export function getSpeciesAvailables(state$: Observable<IAppState>) {
    return state$.select(state => {
        let species = [];
        for (let i in state.analyse.usedSurveys) {
            for(let j in state.analyse.usedSurveys[i].counts){
                for(let k in state.analyse.usedSurveys[i].counts[j].mesures){
                    let cs: Species[] = state.species.entities.filter(sp => sp.code === state.analyse.usedSurveys[i].counts[j].mesures[k].codeSpecies);
                    for(let s of cs){
                        if(species.indexOf(s)<0){
                            species.push(s);
                        }
                    }
                }
            }
        }
        return species.sort();
    })
}