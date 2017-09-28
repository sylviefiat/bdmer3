import { Observable } from 'rxjs/Observable';
import { Country } from '../models/country';
import { IAppState } from '../../ngrx/index';

export interface ICountriesState {
  loaded: boolean;
  loading: boolean;
  entities: Country[];
  ids: string[];
  //currentCountryId: string;
  error: string | null;
  countryList: any[];
}

export const countriesInitialState: ICountriesState = {
  loaded: false,
  loading: false,
  entities: [],
  ids: [],
  //currentCountryId: null,
  error: null,
  countryList: []
};

export function getCountriesLoaded(state$: Observable<ICountriesState>){
  return state$.select(state => state.loaded);
}

export function getCountriesLoading(state$: Observable<ICountriesState>){
  return state$.select(state => state.loading);
}

export function getCountriesEntities(state$: Observable<ICountriesState>){
  return state$.select(state => state.entities);
}

export function getCountriesIds(state$: Observable<ICountriesState>){
  return state$.select(state => state.ids);
}

/*export function getCurrentCountryId(state$: Observable<ICountriesState>){
  return state$.select(state => state.currentCountryId);
}

export function getCurrentCountry(state$: Observable<ICountriesState>){
  return state$.select(state => state.entities[state.currentCountryId]);
}*/

export function getCountryError(state$: Observable<ICountriesState>){
  return state$.select(state => state.error);
}

export function getCountryNamesList(state$: Observable<ICountriesState>){
  return state$.select(state => state.countryList);
}