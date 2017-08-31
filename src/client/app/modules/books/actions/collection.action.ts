import { Action } from '@ngrx/store';
import { Book } from '../models/book';
import { type } from '../../core/utils/index';

export namespace CollectionAction {
  // Category to uniquely identify the actions
  export const COLLECTION: string = 'CollectionAction';


  export interface ICollectionActions {
      ADD_BOOK: string;
      ADD_BOOK_SUCCESS: string;
      ADD_BOOK_FAIL: string;
      REMOVE_BOOK: string;
      REMOVE_BOOK_SUCCESS: string;
      REMOVE_BOOK_FAIL: string;
      LOAD: string;
      LOAD_SUCCESS: string;
      LOAD_FAIL: string;
    }

    export const ActionTypes: ICollectionActions = {
      ADD_BOOK: type(`${COLLECTION} Add Book`),
      ADD_BOOK_SUCCESS: type(`${COLLECTION} Add Book Success`),
      ADD_BOOK_FAIL: type(`${COLLECTION} Add Book Fail`),
      REMOVE_BOOK: type(`${COLLECTION} Remove Book`),
      REMOVE_BOOK_SUCCESS: type(`${COLLECTION} Remove Book Success`),
      REMOVE_BOOK_FAIL: type(`${COLLECTION} Remove Book Fail`),
      LOAD: type(`${COLLECTION} Load`),
      LOAD_SUCCESS: type(`${COLLECTION} Load Success`),
      LOAD_FAIL: type(`${COLLECTION} Load Fail`)
    };

  /**
   * Add Book to Collection Actions
   */
  export class AddBookAction implements Action {
    readonly type = ActionTypes.ADD_BOOK;

    constructor(public payload: Book) {}
  }

  export class AddBookSuccessAction implements Action {
    readonly type = ActionTypes.ADD_BOOK_SUCCESS;

    constructor(public payload: Book) {}
  }

  export class AddBookFailAction implements Action {
    readonly type = ActionTypes.ADD_BOOK_FAIL;

    constructor(public payload: Book) {}
  }

  /**
   * Remove Book from Collection Actions
   */
  export class RemoveBookAction implements Action {
    readonly type = ActionTypes.REMOVE_BOOK;

    constructor(public payload: Book) {}
  }

  export class RemoveBookSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_BOOK_SUCCESS;

    constructor(public payload: Book) {}
  }

  export class RemoveBookFailAction implements Action {
    readonly type = ActionTypes.REMOVE_BOOK_FAIL;

    constructor(public payload: Book) {}
  }

  /**
   * Load Collection Actions
   */
  export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;
    payload: string = null;
  }

  export class LoadSuccessAction implements Action {    
    readonly type = ActionTypes.LOAD_SUCCESS;
    constructor(public payload: Book[]) {}
  }

  export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;
    constructor(public payload: any) {}
  }

  export type Actions =
    | AddBookAction
    | AddBookSuccessAction
    | AddBookFailAction
    | RemoveBookAction
    | RemoveBookSuccessAction
    | RemoveBookFailAction
    | LoadAction
    | LoadSuccessAction
    | LoadFailAction;
 }
