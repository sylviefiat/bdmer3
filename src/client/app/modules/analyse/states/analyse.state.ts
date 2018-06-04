import { compose } from '@ngrx/store';
import * as Turf from '@turf/turf';

import { User, Country } from '../../countries/models/country';
import { Platform, Zone, Station, Survey, Species } from '../../datas/models/index';
import { Method, Results, Data, DimensionsAnalyse } from '../models/analyse';
import { IAppState, getPlatformInApp, getSpeciesInApp } from '../../ngrx/index';

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
export const getUsedCountry = (state: IAnalyseState) => state.usedCountry;

export const getUsedPlatforms = (state: IAnalyseState) => state.usedPlatforms;

export const getUsedYears = (state: IAnalyseState) => state.usedYears;

export const getUsedSurveys = (state: IAnalyseState) => state.usedSurveys;

export const getUsedZones = (state: IAnalyseState) => state.usedZones;

export const getUsedStations = (state: IAnalyseState) => state.usedStations;

export const getUsedSpecies = (state: IAnalyseState) => state.usedSpecies;

export const getUsedDims = (state: IAnalyseState) => state.usedDims;

export const getUsedMethod = (state: IAnalyseState) => state.usedMethod;

export const getAnalysing = (state: IAnalyseState) => state.analysing;

export const getAnalysed = (state: IAnalyseState) => state.analysed;

export const getSelectedData = (state: IAnalyseState) => compose(getUsedCountry,getUsedPlatforms,getUsedYears,
    getUsedSurveys,getUsedZones,getUsedStations,getUsedSpecies,(country,platform,years,surveys,zones,stations,species) => {
            return {
                usedCountry: country,
                usedPlatforms: platform, 
                usedYears: years,
                usedSurveys: surveys,
                usedZones: zones,
                usedStations: stations,
                usedSpecies: species
        }});

export const getData = compose(getSelectedData,getUsedDims,getUsedMethod,
        (selectData,dims,method) => {
            return {
                usedCountry: selectData[1].usedCountry,
                usedPlatforms: selectData[1].usedPlatforms,
                usedYears: selectData[1].usedYears,
                usedSurveys: selectData[1].usedSurveys,
                usedZones: selectData[1].usedZones,
                usedStations: selectData[1].usedStations,
                usedSpecies: selectData[1].usedSpecies,
                usedDims: dims,
                usedMethod: method
            }
        });

export const getResult = (state: IAnalyseState) => state.result;

export const getMsg = (state: IAnalyseState) => state.msg;

export const getYearsAvailables = compose(getUsedPlatforms,(platforms:Platform[])=>{
    let years: string[] = [];
        for(let p of platforms){
                for(let s of p.surveys){
                    let y = new Date(s.dateStart).getFullYear().toString();
                    if(years.indexOf(y)<0){
                        years.push(y);
                    }
                }
            }
        return years.sort();
});

export const getSurveysAvailables = compose(getUsedPlatforms,getUsedYears,(platforms:Platform[], years:string[]) => {
    let surveys: Survey[] = [];
    for(let p of platforms){
        for(let y of years){
            surveys = [...surveys,...p.surveys.filter(s => y===new Date(s.dateStart).getFullYear().toString())];
        }
    }
    return surveys;
});

export const getZonesAvailables = compose(getPlatformInApp,getUsedSurveys,(platforms:Platform[],surveys:Survey[]) => {
    let zones: Zone[] = [];
    for(let s of surveys){
        let sz: Zone[] = platforms.filter(platform => platform.code === s.codePlatform)[0].zones;
        zones = [... zones, ...sz.filter(z => zones.indexOf(z)<0)];
    }
    return zones;
});

export const getStationsAvailables = compose(getUsedPlatforms,getUsedZones,(platforms:Platform[],zones:Zone[])=>{
    let stations = [];
    for(let p of platforms){
        for(let z of zones){
            stations = [...stations,p.stations.filter(s => Turf.booleanPointInPolygon(s.geometry.coordinates,Turf.polygon(z.geometry.coordinates)))];
        }
    }
    return stations;
});

export const getSpeciesAvailables = compose(getSpeciesInApp,getUsedSurveys,(speciesEntities:Species[],surveys:Survey[]) => {
    let species = [];
    for(let s of surveys){
        for(let c of s.counts){            
            for(let m of c.mesures){
                let cs = speciesEntities.filter(sp => sp.code === m.codeSpecies);
                species = [...species, ...cs.filter(sp => species.indexOf(sp.code)<0)];
            }
        }
    }
    return species.sort();
});