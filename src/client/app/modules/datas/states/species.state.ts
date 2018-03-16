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

export function getSpeciesLoaded(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.loaded);
}

export function getSpeciesLoading(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.loading);
}

export function getSpeciesEntities(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.entities);
}

export function getSpeciesIds(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.ids);
}

export function getSpeciesError(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.error);
}

export function getSpeciesMsg(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.msg);
}

export function getCurrentSpeciesId(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.currentSpeciesId);
}

export function getCurrentSpecies(state$: Observable<ISpeciesState>) {
  return state$.select(state => state.currentSpeciesId && state.entities.filter(species => species._id === state.currentSpeciesId)[0]);
}
