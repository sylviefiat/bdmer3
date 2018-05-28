import { Observable } from 'rxjs/Observable';
import { Platform, Survey } from '../models/index';
import { IAppState } from '../../ngrx/index';

export interface IPlatformState {
    loaded: boolean;
    loading: boolean;
    currentPlatformId: string;
    currentZoneId: string;
    currentTransectId: string;
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
    currentTransectId: null,
    currentSpPrefId: null,
    currentCountId: null,
    currentSurveyId: null,
    entities: [],
    ids: [],
    error: null,
    msg: null
};

export function getPlatformLoaded(state$: Observable<IPlatformState>) {
    return state$.select(state => state.loaded);
}

export function getPlatformLoading(state$: Observable<IPlatformState>) {
    return state$.select(state => state.loading);
}

export function getPlatformEntities(state$: Observable<IPlatformState>) {
    return state$.select(state => state.entities);
}

export function getPlatformOfCurrentCountry(state$: Observable<IAppState>) {
    return state$.select(state => {
        if(state.auth.country.code==='AA'){
            return state.platform.entities;
        }
        return state.platform.entities.filter(platform => platform.codeCountry === state.auth.country.code)
    });
}

export function getPlatformsOfCurrentCountry(state$: Observable<IAppState>) {
    console.log(state$);
    return state$
        .select(state => state.country.currentCountryId && state.platform.entities.filter(platform => platform.codeCountry === state.country.currentCountryId));
}

export function getSurveysOfCurrentCountry(state$: Observable<IAppState>) {
    return state$
        .select(state => state.country.currentCountryId && state.platform.entities.filter(platform => platform.codeCountry === state.country.currentCountryId))
        .filter(platforms => platforms && platforms.length>0)
        .map(platforms => {
            let surveys: Survey[] = [];
            for(let platform of platforms) 
                surveys=[...surveys,...platform.surveys];
            return surveys;
        });
}

export function getPlatformIds(state$: Observable<IPlatformState>) {
    return state$.select(state => state.ids);
}

export function getPlatformError(state$: Observable<IPlatformState>) {
    return state$.select(state => state.error);
}

export function getPlatformMsg(state$: Observable<IPlatformState>) {
    return state$.select(state => state.msg);
}

export function getCurrentPlatformId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId);
}

export function getCurrentPlatform(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.entities.filter(platform => platform._id === state.currentPlatformId)[0]);
}

export function getCurrentPlatformZones(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.entities.filter(platform => platform._id === state.currentPlatformId)[0].zones);
}

export function getCurrentPlatformSurveys(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.entities.filter(platform => platform._id === state.currentPlatformId)[0].surveys);
}

export function getCurrentZoneId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentZoneId);
}

export function getCurrentZone(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentZoneId &&
        state.entities.filter(platform =>
            platform._id === state.currentPlatformId)[0].zones.filter(zone =>
                zone.properties.code === state.currentZoneId)[0]);
}

export function getCurrentZoneTransects(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentZoneId &&
        state.entities.filter(platform =>
            platform._id === state.currentPlatformId)[0].zones.filter(zone =>
                zone.properties.code === state.currentZoneId)[0].transects);
}

export function getCurrentZoneZonePrefs(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentZoneId &&
        state.entities.filter(platform =>
            platform._id === state.currentPlatformId)[0].zones.filter(zone =>
                zone.properties.code === state.currentZoneId)[0].zonePreferences);
}

export function getCurrentSurveyId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentSurveyId);
}

export function getCurrentSurvey(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentSurveyId &&
        state.entities.filter(platform => platform._id === state.currentPlatformId)[0]
            .surveys.filter(survey => survey.code === state.currentSurveyId)[0]);
}

export function getCurrentSurveyCounts(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentSurveyId &&
        state.entities.filter(platform => platform._id === state.currentPlatformId)[0]
            .surveys.filter(survey => survey.code === state.currentSurveyId)[0].counts);
}

export function getCurrentTransectId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentTransectId);
}

export function getCurrentTransect(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentZoneId && state.currentTransectId &&
        state.entities.filter(platform =>
            platform._id === state.currentPlatformId)[0].zones.filter(zone =>
                zone.properties.code === state.currentZoneId)[0].transects.filter(transect =>
                    transect.properties.code === state.currentTransectId)[0]);
}

export function getCurrentSpPrefId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentSpPrefId);
}

export function getCurrentSpPref(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentPlatformId && state.currentZoneId && state.currentSpPrefId &&
        state.entities.filter(platform =>
            platform._id === state.currentPlatformId)[0].zones.filter(zone =>
                zone.properties.code === state.currentZoneId)[0].zonePreferences.filter(sppref =>
                    sppref.code === state.currentSpPrefId)[0]);
}

export function getCurrentCountId(state$: Observable<IPlatformState>) {
    return state$.select(state => state.currentCountId);
}

export function getCurrentCount(state$: Observable<IPlatformState>) {
    return state$.select(state => 
        state.currentPlatformId &&  state.currentSurveyId && state.currentCountId &&
            state.entities.filter(platform => platform._id === state.currentPlatformId)[0]
                .surveys.filter(survey => survey.code === state.currentSurveyId)[0]
                .counts.filter(count => count.code === state.currentCountId)[0]
    );
}
