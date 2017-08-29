import { Action } from '@ngrx/store';
import { Book } from '../models/book';
import { type } from '../../core/utils/index';

export namespace BookAction {

  export const BOOK: string = 'BookAction';

  export interface IBookActions {
    SEARCH: string;
    SEARCH_COMPLETE: string;
    LOAD: string;
    SELECT: string;
  }

  export const ActionTypes: IBookActions = {
    SEARCH: type(`${BOOK} Search`),
    SEARCH_COMPLETE: type(`${BOOK} Search Complete`),
    LOAD: type(`${BOOK} Load`),
    SELECT: type(`${BOOK} Select`)
  };

  /**
   * Every action is comprised of at least a type and an optional
   * payload. Expressing actions as classes enables powerful
   * type checking in reducer functions.
   *
   * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
   */
  export class SearchAction implements Action {
    readonly type = ActionTypes.SEARCH;
    constructor(public payload: string) {}
  }

  export class SearchCompleteAction implements Action {
    readonly type = ActionTypes.SEARCH_COMPLETE;
    constructor(public payload: Book[]) {}
  }

  export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;
    constructor(public payload: Book) {}
  }

  export class SelectAction implements Action {
    readonly type = ActionTypes.SELECT;
    constructor(public payload: string) {}
  }

  /**
   * Export a type alias of all actions in this action group
   * so that reducers can easily compose action types
   */
  export type Actions =
    | SearchAction
    | SearchCompleteAction
    | LoadAction
    | SelectAction;
}