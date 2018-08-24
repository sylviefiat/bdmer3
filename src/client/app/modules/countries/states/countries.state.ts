import { Country } from "../models/country";
import { IAppState } from "../../ngrx/index";

export interface ICountriesState {
  loaded: boolean;
  loading: boolean;
  entities: Country[];
  ids: string[];
  error: string | null;
  countryList: any[];
  countryListCount: any[];
  countryListDetails: any;
}

export const countriesInitialState: ICountriesState = {
  loaded: false,
  loading: false,
  entities: [],
  ids: [],
  error: null,
  countryList: [],
  countryListCount: [],
  countryListDetails: []
};
export const getCountriesLoaded = (state: ICountriesState) => state.loaded;

export const getCountriesLoading = (state: ICountriesState) => state.loading;

export const getCountriesEntities = (state: ICountriesState) => state.entities.filter((country: Country) => country.code !== "AA");

export const getAllCountriesEntities = (state: ICountriesState) => state.entities;

export const getCountriesIds = (state: ICountriesState) => state.ids;

export const getCountryError = (state: ICountriesState) => state.error;

export const getCountryNamesList = (state: ICountriesState) => state.countryList;

export const getCountryListCount = (state: ICountriesState) => state.countryListCount;

export const getCountryDetailsList = (state: ICountriesState) => state.countryListDetails;

