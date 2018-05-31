import { Observable } from 'rxjs/Observable';
import { Species } from '../models/index';
import { IAppState } from '../../ngrx/index';

export interface ISpeciesState {
  loaded: boolean;
  loading: boolean;
  currentSpeciesId: string;
  entities: Species[];
  ids: string[];
  error: string | null;
  msg: string | null;
}

export const speciesInitialState: ISpeciesState = {
  loaded: false,
  loading: false,
  currentSpeciesId: null,
  entities: [],
  ids: [],
  error: null,
  msg: null
};

export const getSpeciesLoaded = (state:ISpeciesState) => state.loaded;
/*export function getSpeciesLoaded(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.loaded);
}*/
export const getSpeciesLoading = (state:ISpeciesState) => state.loading;
/*export function getSpeciesLoading(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.loading);
}*/
export const getSpeciesEntities = (state:ISpeciesState) => state.entities;
/*export function getSpeciesEntities(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.entities);
}*/
export const getSpeciesIds = (state:ISpeciesState) => state.ids;
/*export function getSpeciesIds(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.ids);
}*/
export const getSpeciesError = (state:ISpeciesState) => state.error;
/*export function getSpeciesError(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.error);
}*/
export const getSpeciesMsg = (state:ISpeciesState) => state.msg;
/*export function getSpeciesMsg(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.msg);
}*/
export const getCurrentSpeciesId = (state:ISpeciesState) => state.currentSpeciesId;
/*export function getCurrentSpeciesId(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.currentSpeciesId);
}*/
export const getCurrentSpecies = (state:ISpeciesState) => state.currentSpeciesId && state.entities.filter(species => species._id === state.currentSpeciesId)[0];
/*export function getCurrentSpecies(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.currentSpeciesId && state.entities.filter(species => species._id === state.currentSpeciesId)[0]);
}*/
