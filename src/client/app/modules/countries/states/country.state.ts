import { Observable } from 'rxjs/Observable';
import { Country, User } from '../models/country';

export interface ICountryState {
  userIds: string[];
  users: { [id: string]: User };
  currentUserId: string;
}

export const countryInitialState: ICountryState = {
  userIds: null,
  users: {},
  currentUserId: null,
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


