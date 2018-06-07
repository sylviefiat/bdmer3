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

export const getURL = (state: IAuthState) => state.latestURL;

export const getRole = (state: IAuthState) => state.role;

export const getRoleIsAdmin = (state: IAuthState) => state => state.country.code === 'AA';

export const getUser = (state: IAuthState) => state.user;

export const getCountry = (state: IAuthState) => state.country;

export const getSessionLoaded = (state: IAuthState) => state.sessionLoaded;
