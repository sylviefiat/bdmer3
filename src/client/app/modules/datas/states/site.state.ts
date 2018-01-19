import { Observable } from 'rxjs/Observable';
import { Site } from '../models/index';
import { IAppState } from '../../ngrx/index';

export interface ISiteState {
    loaded: boolean;
    loading: boolean;
    currentSiteId: string;
    currentZoneId: string;
    currentTransectId: string;
    currentSpPrefId: string;
    currentCountId: string;
    entities: Site[];
    ids: string[];
    error: string | null;
    msg: string | null;
}

export const siteInitialState: ISiteState = {
    loaded: false,
    loading: false,
    currentSiteId: null,
    currentZoneId: null,
    currentTransectId: null,
    currentSpPrefId: null,
    currentCountId: null,
    entities: [],
    ids: [],
    error: null,
    msg: null
};

export function getSiteLoaded(state$: Observable<ISiteState>) {
    return state$.select(state => state.loaded);
}

export function getSiteLoading(state$: Observable<ISiteState>) {
    return state$.select(state => state.loading);
}

export function getSiteEntities(state$: Observable<ISiteState>) {
    return state$.select(state => state.entities);
}

export function getSiteOfCurrentCountry(state$: Observable<IAppState>) {
    console.log(state$);
    return state$.select(state => {
        if(state.country.currentCountryId==='AA')
            return state.site.entities;
        return state.site.entities.filter(site => site.codeCountry === state.country.currentCountryId)
    });
}

export function getSiteIds(state$: Observable<ISiteState>) {
    return state$.select(state => state.ids);
}

export function getSiteError(state$: Observable<ISiteState>) {
    return state$.select(state => state.error);
}

export function getSiteMsg(state$: Observable<ISiteState>) {
    return state$.select(state => state.msg);
}

export function getCurrentSiteId(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId);
}

export function getCurrentSite(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.entities.filter(site => site._id === state.currentSiteId)[0]);
}

export function getCurrentZoneId(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentZoneId);
}

export function getCurrentZone(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.currentZoneId &&
        state.entities.filter(site =>
            site._id === state.currentSiteId)[0].zones.filter(zone =>
                zone.code === state.currentZoneId)[0]);
}

export function getCurrentTransectId(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentTransectId);
}

export function getCurrentTransect(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.currentZoneId && state.currentTransectId &&
        state.entities.filter(site =>
            site._id === state.currentSiteId)[0].zones.filter(zone =>
                zone.code === state.currentZoneId)[0].transects.filter(transect =>
                    transect.code === state.currentTransectId)[0]);
}

export function getCurrentSpPrefId(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSpPrefId);
}

export function getCurrentSpPref(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.currentZoneId && state.currentSpPrefId &&
        state.entities.filter(site =>
            site._id === state.currentSiteId)[0].zones.filter(zone =>
                zone.code === state.currentZoneId)[0].zonePreferences.filter(sppref =>
                    sppref.code === state.currentSpPrefId)[0]);
}

export function getCurrentCountId(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentCountId);
}

export function getCurrentCount(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.currentZoneId && state.currentTransectId && state.currentCountId &&
        state.entities.filter(site =>
            site._id === state.currentSiteId)[0].zones.filter(zone =>
                zone.code === state.currentZoneId)[0].transects.filter(transect =>
                    transect.code === state.currentTransectId)[0].counts.filter(count =>
                      count.code === state.currentCountId)[0]);
}