import { Observable } from 'rxjs/Observable';
import { Species } from '../models/index';
import { IAppState } from '../../ngrx/index';

export interface ISpeciesState {
  loaded: boolean;
  loading: boolean;
  entities: Species[];
  ids: string[];
  error: string | null;
}

export const speciesInitialState: ISpeciesState = {
  loaded: false,
  loading: false,
  entities: [],
  ids: [],
  error: null
};

export function getSpeciesLoaded(state$: Observable<ISpeciesState>){
  return state$.select(state => state.loaded);
}

export function getSpeciesLoading(state$: Observable<ISpeciesState>){
  return state$.select(state => state.loading);
}

export function getSpeciesEntities(state$: Observable<ISpeciesState>){
  return state$.select(state => state.entities);
}

export function getSpeciesIds(state$: Observable<ISpeciesState>){
  return state$.select(state => state.ids);
}

export function getSpeciesyError(state$: Observable<ISpeciesState>){
  return state$.select(state => state.error);
}
