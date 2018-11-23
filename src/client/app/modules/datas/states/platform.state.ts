import { createSelector } from '@ngrx/store';
import { Platform, Survey } from '../models/index';
import { IAppState } from '../../ngrx/index';
import { MapService } from '../../../modules/core/services/map.service';
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
    importErrors: string[];
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
    importErrors:[],
    msg: null
};

export const getPlatformLoaded = (state: IPlatformState) => state.loaded;

export const getPlatformLoading = (state: IPlatformState) => state.loading;

export const getPlatformEntities = (state: IPlatformState) => state.entities;

export const getPlatformOfCurrentCountry = (state: IAppState) => state.auth && state.auth.country && state.auth.country.code && (state.auth.country.code==='AA')?state.platform.entities:state.platform.entities.filter(platform => platform.codeCountry === state.auth.country.code);

export const getPlatformsOfCurrentCountry = (state: IAppState) => state.country.currentCountryId && state.platform.entities.filter(platform => platform.codeCountry === state.country.currentCountryId);

export const getSurveysOfCurrentCountry = createSelector(getPlatformsOfCurrentCountry, (platforms) => {
    let surveys: Survey[] = [];
    for (let platform of platforms)
        surveys = [...surveys, ...platform.surveys];
    return surveys;
});

export const getPlatformIds = (state: IPlatformState) => state.ids;

export const getPlatformError = (state: IPlatformState) => state.error;

export const getPlatformImportErrors = (state: IPlatformState) => state.importErrors;

export const getPlatformMsg = (state: IPlatformState) => state.msg;

export const getCurrentPlatformId = (state: IPlatformState) => state.currentPlatformId;

export const getCurrentPlatform = (state: IPlatformState) => state.currentPlatformId && state.entities.filter(platform => platform._id.toLowerCase() === state.currentPlatformId.toLowerCase())[0];

export const getCurrentPlatformZones = (state: IPlatformState) => state.currentPlatformId && state.entities.filter(platform => platform._id.toLowerCase() === state.currentPlatformId.toLowerCase())[0].zones;

export const getCurrentPlatformStations = (state: IPlatformState) => state.currentPlatformId && state.entities.filter(platform => platform._id.toLowerCase() === state.currentPlatformId.toLowerCase())[0].stations;

export const getCurrentPlatformSurveys = (state: IPlatformState) => state.currentPlatformId && state.entities.filter(platform => platform._id.toLowerCase() === state.currentPlatformId.toLowerCase())[0].surveys;

export const getCurrentZoneId = (state: IPlatformState) => state.currentZoneId;

export const getCurrentZone = (state: IPlatformState) => state.currentPlatformId && state.currentZoneId &&
    state.entities.filter(platform =>
        platform._id.toLowerCase() === state.currentPlatformId.toLowerCase())[0].zones.filter(zone =>
            zone.properties.code.toLowerCase() === state.currentZoneId.toLowerCase())[0];

export const getCurrentZoneStations = createSelector(getCurrentPlatform, getCurrentZone, (platform, zone) => {
    let stations = [];
    for (let s of platform.stations) {
        if (MapService.booleanInPolygon(s,MapService.getPolygon(zone, {name:zone.properties.name}))) {
            stations.push(s);
        }
    }
    return stations;
});

export const getCurrentZoneZonePrefs = (state: IPlatformState) => state.currentPlatformId && state.currentZoneId &&
    state.entities.filter(platform =>
        platform._id.toLowerCase() === state.currentPlatformId.toLowerCase())[0].zones.filter(zone =>
            zone.properties.code === state.currentZoneId)[0].zonePreferences;

export const getCurrentSurveyId = (state: IPlatformState) => state.currentSurveyId;

export const getCurrentSurvey = (state: IPlatformState) => state.currentPlatformId && state.currentSurveyId &&
    state.entities.filter(platform => platform._id === state.currentPlatformId)[0]
        .surveys.filter(survey => survey.code === state.currentSurveyId)[0];

export const getCurrentSurveyCounts = (state: IPlatformState) => state.currentPlatformId && state.currentSurveyId &&
    state.entities.filter(platform => platform._id === state.currentPlatformId)[0]
        .surveys.filter(survey => survey.code === state.currentSurveyId)[0].counts;

export const getCurrentStationId = (state: IPlatformState) => state.currentSurveyId;

export const getCurrentStation = (state: IPlatformState) => state.currentPlatformId && state.currentStationId &&
    state.entities.filter(platform =>
        platform._id.toLowerCase() === state.currentPlatformId.toLowerCase())[0].stations.filter(station =>
            station.properties.code === state.currentStationId)[0];

export const getCurrentSpPrefId = (state: IPlatformState) => state.currentSpPrefId;

export const getCurrentSpPref = (state: IPlatformState) => state.currentPlatformId && state.currentZoneId && state.currentSpPrefId &&
    state.entities.filter(platform =>
        platform._id.toLowerCase() === state.currentPlatformId.toLowerCase())[0].zones.filter(zone =>
            zone.properties.code.toLowerCase() === state.currentZoneId.toLowerCase())[0].zonePreferences.filter(sppref =>
                sppref.code === state.currentSpPrefId)[0];

export const getCurrentCountId = (state: IPlatformState) => state.currentCountId;

export const getCurrentCount = (state: IPlatformState) => state.currentPlatformId && state.currentSurveyId && state.currentCountId &&
    state.entities.filter(platform => platform._id.toLowerCase() === state.currentPlatformId.toLowerCase())[0]
        .surveys.filter(survey => survey.code.toLowerCase() === state.currentSurveyId.toLowerCase())[0]
        .counts.filter(count => count.code.toLowerCase() === state.currentCountId.toLowerCase())[0];

