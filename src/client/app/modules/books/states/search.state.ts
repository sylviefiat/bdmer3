import { Observable } from 'rxjs/Observable';
import { IAppState } from '../../ngrx/index';

export interface ISearchState {
  ids: string[];
  loading: boolean;
  query: string;
}

export const searchInitialState: ISearchState = {
  ids: [],
  loading: false,
  query: '',
};

export function getSearchBookIds(state$: Observable<ISearchState>){
  return state$.select(state => state.ids);
}

export function getSearchQuery(state$: Observable<ISearchState>){ 
  return state$.select(state => state.query); 
}

export function getSearchLoading(state$: Observable<ISearchState>){
  return state$.select(state => state.loading);
}

export function getSearchResults(state$: Observable<IAppState>){
  return state$.select(state => state.search.ids.map(id => state.book.entities[id]));
}