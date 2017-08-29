import { Observable } from 'rxjs/Observable';
import { Book } from '../models/book';

export interface IBookState {
  ids: string[];
  entities: { [id: string]: Book };
  selectedBookId: string | null;
}

export const bookInitialState: IBookState = {
  ids: [],
  entities: {},
  selectedBookId: null,
};


export function getBooksEntities(state$: Observable<IBookState>){
  return state$.select(state => state.entities);
}

export function getBookIds(state$: Observable<IBookState>){
  return state$.select(state => state.ids);
}

export function getSelectedBookId(state$: Observable<IBookState>){
  return state$.select(state => state.selectedBookId);
}

export function getSelectedBook(state$: Observable<IBookState>){
  return state$.select(state => state.entities[state.selectedBookId]);
}

export function getAll(state$: Observable<IBookState>){
  return state$.select(state => state.ids.map(id => state.entities[id]));
}

