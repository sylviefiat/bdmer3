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

export function getLoggedIn(state$: Observable<IAuthState>) {
    return state$.select(state => state.loggedIn);
}

export function getURL(state$: Observable<IAuthState>) {
    return state$.select(state => state.latestURL);
}

export function getRole(state$: Observable<IAuthState>) {
    return state$.select(state => state.role);
}

export function getUser(state$: Observable<IAuthState>) {
    return state$.select(state => state.user);
}

export function getCountry(state$: Observable<IAuthState>) {
    return state$.select(state => state.country);
}

export function getSessionLoaded(state$: Observable<IAuthState>) {
    return state$.select(state => state.sessionLoaded);
}