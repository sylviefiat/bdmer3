// libs
import { Observable } from 'rxjs/Observable';
// import { combineLatest } from 'rxjs/observable/combineLatest';
import { ActionReducer } from '@ngrx/store';
import { createSelector } from 'reselect';
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
import * as fromMultilingual from '../i18n/index';
import * as fromSample from '../sample/index';
import * as fromBooks from '../books/index';
import * as fromAuth from '../auth/index';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface IAppState {
  i18n: fromMultilingual.IMultilingualState;
  sample: fromSample.ISampleState;
  book: fromBooks.IBookState;
  collection: fromBooks.ICollectionState;
  search: fromBooks.ISearchState;
  auth: fromAuth.IAuthState;
  loginpage: fromAuth.ILoginPageState;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  i18n: fromMultilingual.reducer,
  sample: fromSample.reducer,
  book: fromBooks.bookReducer,
  collection: fromBooks.collectionReducer,
  search: fromBooks.searchReducer,
  auth: fromAuth.authReducer,
  loginpage: fromAuth.loginPageReducer
};

// ensure state is frozen as extra level of security when developing
// helps maintain immutability
const developmentReducer: ActionReducer<IAppState> = compose(storeFreeze, combineReducers)(reducers);
// for production, dev has already been cleared so no need
const productionReducer: ActionReducer<IAppState> = combineReducers(reducers);

export function AppReducer(state: any, action: any) {
  if (String('<%= BUILD_TYPE %>') === 'dev') {
    return developmentReducer(state, action);
  } else {
    return productionReducer(state, action);
  }
}

export function getMultilingualState(state$: Observable<IAppState>): Observable<fromMultilingual.IMultilingualState> {
  return state$.select(s => s.i18n);
}
export function getNameListState(state$: Observable<IAppState>): Observable<fromSample.ISampleState> {
  return state$.select(s => s.sample);
}
export function getBookState(state$: Observable<IAppState>): Observable<fromBooks.IBookState> {
  return state$.select(s => s.book);
}
export function getCollectionState(state$: Observable<IAppState>): Observable<fromBooks.ICollectionState> {
  return state$.select(s => s.collection);
}
export function getSearchState(state$: Observable<IAppState>): Observable<fromBooks.ISearchState> {
  return state$.select(s => s.search);
}
export function getAuthState(state$: Observable<IAppState>): Observable<fromAuth.IAuthState> {
  return state$.select(s => s.auth);
}
export function getLoginPageState(state$: Observable<IAppState>): Observable<fromAuth.ILoginPageState> {
  return state$.select(s => s.loginpage);
}
export function getAppState(state$: Observable<IAppState>): Observable<IAppState> {
  return state$.select(s => s);
}

export const getLang: any = compose(fromMultilingual.getLang, getMultilingualState);
export const getNames: any = compose(fromSample.getNames, getNameListState);

export const getBookEntities: any = compose(fromBooks.getBooksEntities, getBookState);
export const getBooksIds: any = compose(fromBooks.getBookIds, getBookState);
export const getSelectedBookId: any = compose(fromBooks.getSelectedBookId, getBookState);

export const getSelectedBook = compose(fromBooks.getSelectedBook,getBookState);
export const getAll = compose(fromBooks.getAll,getBookState);


export const getCollectionLoaded = compose(fromBooks.getCollectionLoaded, getCollectionState);
export const getCollectionLoading: any = compose(fromBooks.getCollectionLoading, getCollectionState);
export const getCollectionBookIds: any = compose(fromBooks.getCollectionBookIds, getCollectionState);

export const getBookCollection: any = compose(fromBooks.getCollectionBook,getAppState);


export const isSelectedBookInCollection: any = compose(fromBooks.isSelectedBookInCollection,getAppState);

export const getSearchBookIds: any = compose(fromBooks.getSearchBookIds, getSearchState);
export const getSearchQuery: any = compose(fromBooks.getSearchQuery, getSearchState);
export const getSearchLoading: any = compose(fromBooks.getSearchLoading, getSearchState);
export const getSearchResults: any = compose(fromBooks.getSearchResults, getAppState);

export const getLoggedIn: any = compose(fromAuth.getLoggedIn, getAuthState);
export const getUser: any = compose(fromAuth.getUser, getAuthState);
export const getLoginPagePending: any = compose(fromAuth.getPending, getLoginPageState);
export const getLoginPageError: any = compose(fromAuth.getError, getLoginPageState);
