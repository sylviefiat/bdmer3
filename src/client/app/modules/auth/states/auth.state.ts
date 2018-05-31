import { Observable } from 'rxjs/Observable';

import { User, Country } from '../../countries/models/country';

export interface IAuthState {
    loggedIn: boolean;
    latestURL: string;
    role: string;
    user: User | null;
    country: Country | null;
    sessionLoaded: boolean;
}

export const authInitialState: IAuthState = {
    loggedIn: false,
    latestURL: "/",
    role: null,
    user: null,
    country: null,
    sessionLoaded: false
};
export const getLoggedIn = (state: IAuthState) => state.loggedIn;
/*export function getLoggedIn(state$: Observable<IAuthState>) {
    return state$.let(state => state.loggedIn);
}*/
export const getURL = (state: IAuthState) => state.latestURL;
/*export function getURL(state$: Observable<IAuthState>) {
    return state$.let(state => state.latestURL);
}*/
export const getRole = (state: IAuthState) => state.role;
/*export function getRole(state$: Observable<IAuthState>) {
    return state$.let(state => state.role);
}*/
export const getRoleIsAdmin = (state: IAuthState) => state => state.country.code === 'AA';
/*export function getRoleIsAdmin(state$: Observable<IAuthState>) {
    return state$.let(state => state.country.code === 'AA');
}*/
export const getUser = (state: IAuthState) => state.user;
/*export function getUser(state$: Observable<IAuthState>) {
    return state$.let(state => state.user);
}*/
export const getCountry = (state: IAuthState) => state.country;
/*export function getCountry(state$: Observable<IAuthState>) {
    return state$.let(state => state.country);
}*/
export const getSessionLoaded = (state: IAuthState) => state.sessionLoaded;
/*export function getSessionLoaded(state$: Observable<IAuthState>) {
    return state$.let(state => state.sessionLoaded);
}*/