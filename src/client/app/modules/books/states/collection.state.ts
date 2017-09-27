import { Observable } from 'rxjs/Observable';
import { Book } from '../models/book';
import { IAppState } from '../../ngrx/index';

export interface ICollectionState {
  loaded: boolean;
  loading: boolean;
  ids: string[];
}

export const collectionInitialState: ICollectionState = {
  loaded: false,
  loading: false,
  ids: [],
};

export function getCollectionLoaded(state$: Observable<ICollectionState>){
  return state$.select(state => state.loaded);
}

export function getCollectionLoading(state$: Observable<ICollectionState>){
  return state$.select(state => state.loading);
}

export function getCollectionBookIds(state$: Observable<ICollectionState>){
  return state$.select(state => state.ids);
}

export function getCollectionBook(state$: Observable<IAppState>){
  console.log(state$);
  return state$.select(state => state.collection.ids.map(id => state.book.entities[id]));
}

export function isSelectedBookInCollection(state$: Observable<IAppState>){
  return state$.select(state => state.collection.ids.indexOf(state.book.selectedBookId) > -1);
}

