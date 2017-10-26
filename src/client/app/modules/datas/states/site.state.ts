import { Observable } from 'rxjs/Observable';
import { Site } from '../models/index';
import { IAppState } from '../../ngrx/index';

export interface ISiteState {
  loaded: boolean;
  loading: boolean;
  currentSiteId: string;
  entities: Site[];
  ids: string[];
  error: string | null;
  msg: string | null;
}

export const siteInitialState: ISiteState = {
  loaded: false,
  loading: false,
  currentSiteId: null,
  entities: [],
  ids: [],
  error: null,
  msg: null
};

export function getSiteLoaded(state$: Observable<ISiteState>){
  return state$.select(state => state.loaded);
}

export function getSiteLoading(state$: Observable<ISiteState>){
  return state$.select(state => state.loading);
}

export function getSiteEntities(state$: Observable<ISiteState>){
  return state$.select(state => state.entities);
}

export function getSiteIds(state$: Observable<ISiteState>){
  return state$.select(state => state.ids);
}

export function getSiteError(state$: Observable<ISiteState>){
  return state$.select(state => state.error);
}

export function getSiteMsg(state$: Observable<ISiteState>){
  return state$.select(state => state.msg);
}

export function getCurrentSiteId(state$: Observable<ISiteState>){
  return state$.select(state => state.currentSiteId);
}

export function getCurrentSite(state$: Observable<ISiteState>){
  return state$.select(state => state.currentSiteId && state.entities.filter(site => site._id === state.currentSiteId)[0]);
}