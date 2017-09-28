import { Observable } from 'rxjs/Observable';
import { Country, User } from '../models/country';
import { IAppState } from '../../ngrx/index';

export interface ICountryState {
  userIds: string[];
  users: { [id: string]: User };
  currentUserId: string;
  currentCountryId: string;
 /* error: string | null;
  pending: boolean;*/
}

export const countryInitialState: ICountryState = {
  userIds: null,
  users: {},
  currentUserId: null,
  currentCountryId: null
 /* pending: false,
  error: null*/
};


export function getCountryUsers(state$: Observable<ICountryState>){
  return state$.select(state => state.users);
}

export function getCountryUsersId(state$: Observable<ICountryState>){
  return state$.select(state => state.userIds);
}

export function getCurrentUserId(state$: Observable<ICountryState>){
  return state$.select(state => state.currentUserId);
}

export function getCurrentUser(state$: Observable<ICountryState>){
  return state$.select(state => state.users[state.currentUserId]);
}

export function getCurrentCountry(state$: Observable<IAppState>){
  return state$.select(state => state.countries.entities[state.country.currentCountryId]);
}

/*export function getUserError(state$: Observable<ICountryState>){
  return state$.select(state => state.error);
}

export function getUserPending(state$: Observable<ICountryState>){
  return state$.select(state => state.pending);
}*/


