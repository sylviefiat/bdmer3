// libs
import { Observable } from 'rxjs/Observable';
// import { combineLatest } from 'rxjs/observable/combineLatest';
import { ActionReducer } from '@ngrx/store';
import '@ngrx/core/add/operator/select';

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import { compose } from '@ngrx/core/compose';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers } from '@ngrx/store';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import { IMultilingualState, multilingualReducer, getLang } from '../i18n/index';
import { ISampleState, reducer, getNames} from '../sample/index';
import { IBookState, bookReducer, getBooksEntities, getBookIds, getSelectedBookId, getSelectedBook, getAll } from '../books/index';
import { ICollectionState, collectionReducer, getCollectionLoaded, getCollectionLoading, getCollectionBookIds, getCollectionBook, isSelectedBookInCollection } from '../books/index';
import { ISearchState, searchReducer, getSearchBookIds, getSearchResults, getSearchLoading, getSearchQuery } from '../books/index';
import { IAuthState, ILoginPageState, authReducer, loginPageReducer, getLoggedIn, getPending, getError, getRole, getUser, getCountry, getURL, getSessionLoaded, getRoleIsAdmin} from '../auth/index';
import { ICountriesState, countriesReducer, getCountriesLoaded, getCountriesLoading, getCountriesEntities, getAllCountriesEntities, getCountriesIds, getCountryNamesList} from '../countries/index';
import { ICountryState, countryReducer, getCountryUsers, getCountryUsersId, getCurrentUserId, getCurrentUser, getCountryError, getCurrentCountry} from '../countries/index';
import { ISpeciesState, speciesReducer, getSpeciesLoaded, getSpeciesLoading, getSpeciesEntities, getSpeciesIds, getSpeciesError, getSpeciesMsg, getCurrentSpecies } from '../datas/index';
import { ISiteState, siteReducer, getSiteLoaded, getSiteLoading, getSiteEntities, getSiteIds, getSiteError, getSiteMsg, getSiteOfCurrentCountry} from '../datas/index';
import { getCurrentSite, getCurrentSiteZones, getCurrentSiteCampaigns, getCurrentZone, getCurrentZoneTransects, getCurrentZoneZonePrefs, getCurrentTransect, getCurrentCount, getCurrentSpPref, getCurrentCampaign } from '../datas/index';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface IAppState {
  i18n: IMultilingualState;
  sample: ISampleState;
  book: IBookState;
  collection: ICollectionState;
  search: ISearchState;
  auth: IAuthState;
  loginpage: ILoginPageState;
  countries: ICountriesState;
  country: ICountryState;
  species: ISpeciesState;
  site: ISiteState;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  i18n: multilingualReducer,
  sample: reducer,
  book: bookReducer,
  collection: collectionReducer,
  search: searchReducer,
  auth: authReducer,
  loginpage: loginPageReducer,
  countries: countriesReducer,
  country: countryReducer,
  species: speciesReducer,
  site: siteReducer
};

// ensure state is frozen as extra level of security when developing
// helps maintain immutability
//const developmentReducer: ActionReducer<IAppState> = compose(storeFreeze, combineReducers)(reducers);
const developmentReducer: ActionReducer<IAppState> = combineReducers(reducers);
// for production, dev has already been cleared so no need
const productionReducer: ActionReducer<IAppState> = combineReducers(reducers);

export function AppReducer(state: any, action: any) {
  if (String('<%= BUILD_TYPE %>') === 'dev') {
    return developmentReducer(state, action);
  } else {
    return productionReducer(state, action);
  }
}

export function getMultilingualState(state$: Observable<IAppState>): Observable<IMultilingualState> {
  return state$.select(s => s.i18n);
}
export function getNameListState(state$: Observable<IAppState>): Observable<ISampleState> {
  return state$.select(s => s.sample);
}
export function getBookState(state$: Observable<IAppState>): Observable<IBookState> {
  return state$.select(s => s.book);
}
export function getCollectionState(state$: Observable<IAppState>): Observable<ICollectionState> {
  return state$.select(s => s.collection);
}
export function getSearchState(state$: Observable<IAppState>): Observable<ISearchState> {
  return state$.select(s => s.search);
}
export function getAuthState(state$: Observable<IAppState>): Observable<IAuthState> {
  return state$.select(s => s.auth);
}
export function getLoginPageState(state$: Observable<IAppState>): Observable<ILoginPageState> {
  return state$.select(s => s.loginpage);
}
export function getCountriesState(state$: Observable<IAppState>): Observable<ICountriesState> {
  return state$.select(s => s.countries);
}
export function getCountryState(state$: Observable<IAppState>): Observable<ICountryState> {
  return state$.select(s => s.country);
}
export function getSpeciesState(state$: Observable<IAppState>): Observable<ISpeciesState> {
  return state$.select(s => s.species);
}
export function getSiteState(state$: Observable<IAppState>): Observable<ISiteState> {
  return state$.select(s => s.site);
}
export function getAppState(state$: Observable<IAppState>): Observable<IAppState> {
  return state$.select(s => s);
}

// i18n
export const getLangues: any = compose(getLang, getMultilingualState);
export const getListNames: any = compose(getNames, getNameListState);

// Book
export const getBookEntities: any = compose(getBooksEntities, getBookState);
export const getBooksIds: any = compose(getBookIds, getBookState);
export const getIdBookSelected: any = compose(getSelectedBookId, getBookState);
export const getBookSelected = compose(getSelectedBook,getBookState);
export const getAllBooks = compose(getAll,getBookState);

// Collection
export const getCollectionisLoaded = compose(getCollectionLoaded, getCollectionState);
export const getCollectionisLoading: any = compose(getCollectionLoading, getCollectionState);
export const getBookIdsCollection: any = compose(getCollectionBookIds, getCollectionState);
export const getBookCollection: any = compose(getCollectionBook,getAppState);
export const selectedBookInCollection: any = compose(isSelectedBookInCollection,getAppState);

// Search
export const getBookIdsSearch: any = compose(getSearchBookIds, getSearchState);
export const getQuerySearch: any = compose(getSearchQuery, getSearchState);
export const getLoadingSearch: any = compose(getSearchLoading, getSearchState);
export const getResultsSearch: any = compose(getSearchResults, getAppState);

// Auth
export const getisLoggedIn: any = compose(getLoggedIn, getAuthState);
export const getLatestURL: any = compose(getURL, getAuthState);
export const getAuthUser: any = compose(getUser, getAuthState);
export const getRoleUser: any = compose(getRole, getAuthState);
export const getisAdmin: any = compose(getRoleIsAdmin, getAuthState);
export const getAuthCountry: any = compose(getCountry, getAuthState);
export const getisSessionLoaded: any = compose(getSessionLoaded, getAuthState);

// Login page
export const getLoginPagePending: any = compose(getPending, getLoginPageState);
export const getLoginPageError: any = compose(getError, getLoginPageState);
export const getSignupPagePending: any = compose(getPending, getLoginPageState);
export const getSignupPageError: any = compose(getError, getLoginPageState);

// Countries
export const getCountryList: any = compose(getCountryNamesList, getCountriesState);
export const getCountriesisLoaded: any = compose(getCountriesLoaded, getCountriesState);
export const getCountriesisLoading: any = compose(getCountriesLoading, getCountriesState);
export const getCountriesInApp: any = compose(getCountriesEntities, getCountriesState);
export const getAllCountriesInApp: any = compose(getAllCountriesEntities, getCountriesState);
export const getCountriesIdsInApp: any = compose(getCountriesIds, getCountriesState);
export const getCountryPageError: any = compose(getCountryError, getCountriesState);

// Country
export const getSelectedCountry: any = compose(getCurrentCountry, getAppState);
export const getUsersCountry: any = compose(getCountryUsers, getCountryState);
export const getUserCountry: any = compose(getCurrentUser, getCountryState);

// Species
export const getSpeciesisLoaded: any = compose(getSpeciesLoaded, getSpeciesState);
export const getSpeciesisLoading: any = compose(getSpeciesLoading, getSpeciesState);
export const getSpeciesInApp: any = compose(getSpeciesEntities, getSpeciesState);
export const getSpeciesIdsInApp: any = compose(getSpeciesIds, getSpeciesState);
export const getSpeciesPageError: any = compose(getSpeciesError, getSpeciesState);
export const getSpeciesPageMsg: any = compose(getSpeciesMsg, getSpeciesState);
export const getSelectedSpecies: any = compose(getCurrentSpecies, getSpeciesState);

// Site
export const getSiteisLoaded: any = compose(getSiteLoaded, getSiteState);
export const getSiteisLoading: any = compose(getSiteLoading, getSiteState);
export const getSiteInApp: any = compose(getSiteEntities, getSiteState);
export const getSiteIdsInApp: any = compose(getSiteIds, getSiteState);
export const getSitePageError: any = compose(getSiteError, getSiteState);
export const getSitePageMsg: any = compose(getSiteMsg, getSiteState);
export const getSelectedSite: any = compose(getCurrentSite, getSiteState);
export const getSelectedSiteZones: any = compose(getCurrentSiteZones, getSiteState);
export const getSelectedSiteCampaigns: any = compose(getCurrentSiteCampaigns, getSiteState);
export const getSelectedZone: any = compose(getCurrentZone, getSiteState);
export const getSelectedZoneTransects: any = compose(getCurrentZoneTransects, getSiteState);
export const getSelectedZoneZonePrefs: any = compose(getCurrentZoneZonePrefs, getSiteState);
export const getSelectedZonePref: any = compose(getCurrentSpPref, getSiteState);
export const getSelectedTransect: any = compose(getCurrentTransect, getSiteState);
export const getSelectedCampaign: any = compose(getCurrentCampaign, getSiteState);
export const getSelectedCount: any = compose(getCurrentCount, getSiteState);
export const getSiteListCurrentCountry: any = compose(getSiteOfCurrentCountry, getAppState);