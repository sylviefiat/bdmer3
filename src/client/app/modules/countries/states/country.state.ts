import { Country, User } from '../models/country';
import { IAppState } from '../../ngrx/index';

export interface ICountryState {
  userIds: string[];
  users: { [id: string]: User };
  currentUserId: string;
  currentCountryId: string;
  error: string | null;
  msg: string | null
}

export const countryInitialState: ICountryState = {
  userIds: null,
  users: {},
  currentUserId: null,
  currentCountryId: null,
  error: null,
  msg: null
};

export const getCountryUsers = (state: ICountryState) => state.users;

export const getCountryUsersId = (state: ICountryState) => state.userIds;

export const getCurrentUserId = (state: ICountryState) => state.currentUserId;

export const getCurrentUser = (state: IAppState) => state.country.currentCountryId && state.country.currentUserId &&
                                                          state.countries.entities
                                                            .filter(country => country.code === state.country.currentCountryId)[0].users
                                                            .filter(user => user.username === state.country.currentUserId)[0];

export const getCurrentCountry = (state: IAppState) => state.countries.entities.filter(country => country.code === state.country.currentCountryId)[0];

export const getUserError = (state: ICountryState) => state.error;

export const getUserMsg = (state: ICountryState) => state.msg;



