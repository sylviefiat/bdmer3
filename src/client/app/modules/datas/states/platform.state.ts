import { Observable } from 'rxjs/Observable';
import { createSelector } from '@ngrx/store';
import { Platform, Survey } from '../models/index';
import { IAppState } from '../../ngrx/index';
import * as Turf from '@turf/turf';

export interface IPlatformState {
    loaded: boolean;
    loading: boolean;
    currentPlatformId: string;
    currentZoneId: string;
    currentStationId: string;
    currentSpPrefId: string;
    currentCountId: string;
    currentSurveyId: string;
    entities: Platform[];
    ids: string[];
    error: string | null;
    msg: string | null;
}

export const platformInitialState: IPlatformState = {
    loaded: false,
    loading: false,
    currentPlatformId: null,
    currentZoneId: null,
    currentStationId: null,
    currentSpPrefId: null,
    currentCountId: null,
    currentSurveyId: null,
    entities: [],
    ids: [],
    error: null,
    msg: null
};

export const getPlatformLoaded = (state: IPlatformState) => state.loaded;
/*export function getPlatformLoaded(state$: Observable<IPlatformState>) {
    return state$.select(state => state.loaded);
}*/
export const getPlatformLoading = (state: IPlatformState) => state.loading;
/*export function getPlatformLoading(state$: Observable<IPlatformState>) {
    return state$.select(state => state.loading);
}*/
export const getPlatformEntities = (state: IPlatformState) => state.entities;
/*export function getPlatformEntities(state$: Observable<IPlatformState>) {
    return state$.select(state => state.entities);
}*/
export const getPlatformOfCurrentCountry = (state: IAppState) => state.auth && state.auth.country && state.auth.country.code 
    && state.platform.entities.filter(platform => (state.auth.country.code==='AA')?state.platform.entities:state.platform.entities.filter(platform => platform.codeCountry === state.auth.country.code));
/*export function getPlatformOfCurrentCountry(state$: Observable<IAppState>) {
    return state$.select(state => {
        if(state.auth.country.code==='AA'){
            return state.platform.entities;
        }
        return state.platform.entities.filter(platform => platform.codeCountry === state.auth.country.code)
    });
}*/
export const getPlatformsOfCurrentCountry = (state: IAppState) => state.country.currentCountryId && state.platform.entities.filter(platform => platform.codeCountry === state.country.currentCountryId);
/*export function getPlatformsOfCurrentCountry(state$: Observable<IAppState>) {
    console.log(state$);
    return state$
        .select(state => state.country.currentCountryId && state.platform.entities.filter(platform => platform.codeCountry === state.country.currentCountryId));
}*/
export const getSurveysOfCurrentCountry = createSelector(getPlatformsOfCurrentCountry, (platforms) => {
    let surveys: Survey[] = [];
    for (let platform of platforms)
        surveys = [...surveys, ...platform.surveys];
    return surveys;
});
/*export function getSurveysOfCurrentCountry(state$: Observable<IAppState>) {
    return state$
        .select(state => state.country.currentCountryId && state.platform.entities.filter(platform => platform.codeCountry === state.country.currentCountryId))
        .filter(platforms => platforms && platforms.length>0)
        .map(platforms => {
            let surveys: Survey[] = [];
            for(let platform of platforms) 
                surveys=[...surveys,...platform.surveys];
            return surveys;
        });
}*/
export const getPlatformIds = (state: IPlatformState) => state.ids;
/*export function getPlatformIds(state$: Observable<IPlatformState>) {
    return state$.select(state => state.ids);
}*/
export const getPlatformError = (state: IPlatformState) => state.error;
/*export function getPlatformError(state$: Observable<IPlatformState>) {
    return state$.select(state => state.error);
}*/
export const getPlatformMsg = (state: IPlatformState) => state.msg;
/*export function getPlatformMsg(state$: Observable<IPlatformState>) {
    return state$.select(state => state.msg);
}*/
export const getCurrentPlatformId = (state: IPlatformState) => state.currentPlatformId;
/*export function getCurrentPlatformId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId);
}*/
export const getCurrentPlatform = (state: IPlatformState) => state.currentPlatformId && state.entities.filter(platform => platform._id === state.currentPlatformId)[0];
/*export function getCurrentPlatform(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.entities.filter(platform => platform._id === state.currentPlatformId)[0]);
}*/
export const getCurrentPlatformZones = (state: IPlatformState) => state.currentPlatformId && state.entities.filter(platform => platform._id === state.currentPlatformId)[0].zones;
/*export function getCurrentPlatformZones(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.entities.filter(platform => platform._id === state.currentPlatformId)[0].zones);
}*/
export const getCurrentPlatformStations = (state: IPlatformState) => state.currentPlatformId && state.entities.filter(platform => platform._id === state.currentPlatformId)[0].stations;
/*export function getCurrentPlatformStations(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.entities.filter(platform => platform._id === state.currentPlatformId)[0].stations);
}*/
export const getCurrentPlatformSurveys = (state: IPlatformState) => state.currentPlatformId && state.entities.filter(platform => platform._id === state.currentPlatformId)[0].surveys;
/*export function getCurrentPlatformSurveys(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.entities.filter(platform => platform._id === state.currentPlatformId)[0].surveys);
}*/
export const getCurrentZoneId = (state: IPlatformState) => state.currentZoneId;
/*export function getCurrentZoneId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentZoneId);
}*/
export const getCurrentZone = (state: IPlatformState) => state.currentPlatformId && state.currentZoneId &&
    state.entities.filter(platform =>
        platform._id === state.currentPlatformId)[0].zones.filter(zone =>
            zone.properties.code === state.currentZoneId)[0];
/*export function getCurrentZone(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentZoneId &&
        state.entities.filter(platform =>
            platform._id === state.currentPlatformId)[0].zones.filter(zone =>
                zone.properties.code === state.currentZoneId)[0]);
}*/
export const getCurrentZoneStations = createSelector(getCurrentPlatform, getCurrentZone, (platform, zone) => {
    let stations = [];
    for (let s of platform.stations) {
        if (Turf.booleanPointInPolygon(s.geometry.coordinates, Turf.polygon(zone.geometry.coordinates))) {
            stations.push(s);
        }
    }
    return stations;
});
/*export function getCurrentZoneStations(state$: Observable<IPlatformState>) {    
    return state$.select(state => {
        if(!state.currentPlatformId || !state.currentZoneId){
            return [];            
        }
        let platform = state.entities.filter(platform => platform._id === state.currentPlatformId)[0];
        let zone = platform.zones.filter(zone => zone.properties.code === state.currentZoneId)[0];
        let stations=[];
        for(let s of platform.stations){
            if(Turf.booleanPointInPolygon(s.geometry.coordinates,Turf.polygon(zone.geometry.coordinates))) {
                stations.push(s);
            }
        }
        return stations;
    });
}*/
export const getCurrentZoneZonePrefs = (state: IPlatformState) => state.currentPlatformId && state.currentZoneId &&
    state.entities.filter(platform =>
        platform._id === state.currentPlatformId)[0].zones.filter(zone =>
            zone.properties.code === state.currentZoneId)[0].zonePreferences;
/*export function getCurrentZoneZonePrefs(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentZoneId &&
        state.entities.filter(platform =>
            platform._id === state.currentPlatformId)[0].zones.filter(zone =>
                zone.properties.code === state.currentZoneId)[0].zonePreferences);
}*/
export const getCurrentSurveyId = (state: IPlatformState) => state.currentSurveyId;
/*export function getCurrentSurveyId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentSurveyId);
}*/
export const getCurrentSurvey = (state: IPlatformState) => state.currentPlatformId && state.currentSurveyId &&
    state.entities.filter(platform => platform._id === state.currentPlatformId)[0]
        .surveys.filter(survey => survey.code === state.currentSurveyId)[0];
/*export function getCurrentSurvey(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentSurveyId &&
        state.entities.filter(platform => platform._id === state.currentPlatformId)[0]
            .surveys.filter(survey => survey.code === state.currentSurveyId)[0]);
}*/
export const getCurrentSurveyCounts = (state: IPlatformState) => state.currentPlatformId && state.currentSurveyId &&
    state.entities.filter(platform => platform._id === state.currentPlatformId)[0]
        .surveys.filter(survey => survey.code === state.currentSurveyId)[0].counts;
/*export function getCurrentSurveyCounts(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentSurveyId &&
        state.entities.filter(platform => platform._id === state.currentPlatformId)[0]
            .surveys.filter(survey => survey.code === state.currentSurveyId)[0].counts);
}*/
export const getCurrentStationId = (state: IPlatformState) => state.currentSurveyId;
/*export function getCurrentStationId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentStationId);
}*/
export const getCurrentStation = (state: IPlatformState) => state.currentPlatformId && state.currentStationId &&
    state.entities.filter(platform =>
        platform._id === state.currentPlatformId)[0].stations.filter(station =>
            station.properties.code === state.currentStationId)[0];
/*export function getCurrentStation(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentStationId &&
            state.entities.filter(platform =>
            platform._id === state.currentPlatformId)[0].stations.filter(station =>
                    station.properties.code === state.currentStationId)[0]);
}*/
export const getCurrentSpPrefId = (state: IPlatformState) => state.currentSpPrefId;
/*export function getCurrentSpPrefId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentSpPrefId);
}*/
export const getCurrentSpPref = (state: IPlatformState) => state.currentPlatformId && state.currentZoneId && state.currentSpPrefId &&
    state.entities.filter(platform =>
        platform._id === state.currentPlatformId)[0].zones.filter(zone =>
            zone.properties.code === state.currentZoneId)[0].zonePreferences.filter(sppref =>
                sppref.code === state.currentSpPrefId)[0];
/*export function getCurrentSpPref(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentZoneId && state.currentSpPrefId &&
        state.entities.filter(platform =>
            platform._id === state.currentPlatformId)[0].zones.filter(zone =>
                zone.properties.code === state.currentZoneId)[0].zonePreferences.filter(sppref =>
                    sppref.code === state.currentSpPrefId)[0]);
}*/
export const getCurrentCountId = (state: IPlatformState) => state.currentCountId;
/*export function getCurrentCountId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentCountId);
}*/
export const getCurrentCount = (state: IPlatformState) => state.currentPlatformId && state.currentSurveyId && state.currentCountId &&
    state.entities.filter(platform => platform._id === state.currentPlatformId)[0]
        .surveys.filter(survey => survey.code === state.currentSurveyId)[0]
        .counts.filter(count => count.code === state.currentCountId)[0];
/*export function getCurrentCount(state$: Observable<IPlatformState>) {
    return state$.select(state => 
        state.currentPlatformId &&  state.currentSurveyId && state.currentCountId &&
            state.entities.filter(platform => platform._id === state.currentPlatformId)[0]
                .surveys.filter(survey => survey.code === state.currentSurveyId)[0]
                .counts.filter(count => count.code === state.currentCountId)[0]
    );
}*/
