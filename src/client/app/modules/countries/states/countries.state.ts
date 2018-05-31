import { Observable } from 'rxjs/Observable';
import { Country } from '../models/country';
import { IAppState } from '../../ngrx/index';

export interface ICountriesState {
  loaded: boolean;
  loading: boolean;
  entities: Country[];
  ids: string[];
  error: string | null;
  countryList: any[];
}

export const countriesInitialState: ICountriesState = {
  loaded: false,
  loading: false,
  entities: [],
  ids: [],
  error: null,
  countryList: []
};
export const getCountriesLoaded = (state: ICountriesState) => state.loaded;
/*export function getCountriesLoaded(state$: Observable<ICountriesState>){
  return state$.select(state => state.loaded);
}*/
export const getCountriesLoading = (state: ICountriesState) => state.loading;
/*export function getCountriesLoading(state$: Observable<ICountriesState>){
  return state$.select(state => state.loading);
}*/
export const getCountriesEntities = (state: ICountriesState) => state.entities.filter((country: Country) => country.code !== 'AA');
/*export function getCountriesEntities(state$: Observable<ICountriesState>){
  return state$.select(state => state.entities.filter((country: Country) => country.code !== 'AA'));
}*/
export const getAllCountriesEntities = (state: ICountriesState) => state.entities;
/*export function getAllCountriesEntities(state$: Observable<ICountriesState>){
  return state$.select(state => state.entities);
}*/
export const getCountriesIds = (state: ICountriesState) => state.ids;
/*export function getCountriesIds(state$: Observable<ICountriesState>){
  return state$.select(state => state.ids);
}*/
export const getCountryError = (state: ICountriesState) => state.error;
/*export function getCountryError(state$: Observable<ICountriesState>){
  return state$.select(state => state.error);
}*/
export const getCountryNamesList = (state: ICountriesState) => state.countryList;
/*export function getCountryNamesList(state$: Observable<ICountriesState>){
  return state$.select(state => state.countryList);
}*/