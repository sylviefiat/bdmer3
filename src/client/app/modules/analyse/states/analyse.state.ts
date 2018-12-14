import { createSelector } from '@ngrx/store';
import * as Turf from '@turf/turf';
import * as TurfBPIP from '@turf/boolean-point-in-polygon';

import { User, Country } from '../../countries/models/country';
import { Platform, Zone, Station, Survey, Species } from '../../datas/models/index';
import { Method, Results, Data, DimensionsAnalyse } from '../models/analyse';
import { MapService } from '../../core/services/index';
import { IAppState } from '../../ngrx/index';

export interface IAnalyseState {
    usedCountry: Country;
    usedPlatforms: Platform[];
    usedYears: [];
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
    { method: 'NONE' },
    { method: 'LONGUEUR' },
    { method: 'LONGLARG' }
]
export const getUsedCountry = (state: IAppState) => state.analyse.usedCountry;

export const getUsedPlatforms = (state: IAppState) => state.analyse.usedPlatforms;

export const getUsedYears = (state: IAppState) => state.analyse.usedYears;

export const getUsedSurveys = (state: IAppState) => state.analyse.usedSurveys;

export const getUsedZones = (state: IAppState) => state.analyse.usedZones;

export const getUsedStations = (state: IAppState) => state.analyse.usedStations;

export const getUsedSpecies = (state: IAppState) => state.analyse.usedSpecies;

export const getUsedDims = (state: IAppState) => state.analyse.usedDims;

export const getUsedMethod = (state: IAppState) => state.analyse.usedMethod;

export const getAnalysing = (state: IAnalyseState) => state.analysing;

export const getAnalysed = (state: IAnalyseState) => state.analysed;

const getSpeciesInApp = (state: IAppState) => state.species.entities;

export const getSelectedData = createSelector(getUsedCountry, getUsedPlatforms, getUsedYears,
    getUsedSurveys, getUsedZones, getUsedStations, getUsedSpecies, (country, platform, years, surveys, zones, stations, species) => {
        return {
            usedCountry: country,
            usedPlatforms: platform,
            usedYears: years,
            usedSurveys: surveys,
            usedZones: zones,
            usedStations: stations,
            usedSpecies: species
        }
    });

export const getData = createSelector(getSelectedData, getUsedDims, getUsedMethod,
    (selectData, dims, method) => {
        return {
            usedCountry: selectData.usedCountry,
            usedPlatforms: selectData.usedPlatforms,
            usedYears: selectData.usedYears,
            usedSurveys: selectData.usedSurveys,
            usedZones: selectData.usedZones,
            usedStations: selectData.usedStations,
            usedSpecies: selectData.usedSpecies,
            usedDims: dims,
            usedMethod: method
        }
    });

export const getResult = (state: IAnalyseState) => state.result;

export const getMsg = (state: IAnalyseState) => state.msg;

