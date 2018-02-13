import { Action } from '@ngrx/store';
import { Country, User } from '../models/country';
import { type } from '../../core/utils/index';

export namespace CountryAction {

  export const COUNTRY: string = 'CountryAction';

  export interface ICountryActions {
    ADD_USER: string;
    ADD_USER_SUCCESS: string;
    ADD_USER_FAIL: string;
    REMOVE_USER: string;
    REMOVE_USER_SUCCESS: string;
    REMOVE_USER_FAIL: string;
    LOAD: string;
    LOAD_USER: string;
    SELECT: string;
    SELECT_USER: string;
    REMOVE_MSG: string;
  }

  export const ActionTypes: ICountryActions = {
    ADD_USER: type(`${COUNTRY} Add user`),
    ADD_USER_SUCCESS: type(`${COUNTRY} Add user Success`),
    ADD_USER_FAIL: type(`${COUNTRY} Add user Fail`),
    REMOVE_USER: type(`${COUNTRY} Remove user`),
    REMOVE_USER_SUCCESS: type(`${COUNTRY} Remove user Success`),
    REMOVE_USER_FAIL: type(`${COUNTRY} Remove user Fail`),
    LOAD: type(`${COUNTRY} Load country`),
    LOAD_USER: type(`${COUNTRY} Load user`),
    SELECT: type(`${COUNTRY} Select`),
    SELECT_USER: type(`${COUNTRY} Select User`),
    REMOVE_MSG: type(`${COUNTRY} Remove msg`)
  };

  /**
   * Every action is comprised of at least a type and an optional
   * payload. Expressing actions as classes enables powerful
   * type checking in reducer functions.
   *
   * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
   */
  export class AddUserAction implements Action {
    readonly type = ActionTypes.ADD_USER;

    constructor(public payload: User) {}
  }

  export class AddUserSuccessAction implements Action {
    readonly type = ActionTypes.ADD_USER_SUCCESS;

    constructor(public payload: Country) {}
  }

  export class AddUserFailAction implements Action {
    readonly type = ActionTypes.ADD_USER_FAIL;

    constructor(public payload: any) {}
  }

  /**
   * Remove User from Country Actions
   */
  export class RemoveUserAction implements Action {
    readonly type = ActionTypes.REMOVE_USER;

    constructor(public payload: User) {}
  }

  export class RemoveUserSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_USER_SUCCESS;

    constructor(public payload: Country) {}
  }

  export class RemoveUserFailAction implements Action {
    readonly type = ActionTypes.REMOVE_USER_FAIL;

    constructor(public payload: any) {}
  }

  export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;
    payload: string = null;
  }

  export class LoadUserAction implements Action {
    readonly type = ActionTypes.LOAD_USER;
    payload: string = null;
  }

  export class SelectAction implements Action {
    readonly type = ActionTypes.SELECT;
    constructor(public payload: any) {}
  }

  export class SelectUserAction implements Action {
    readonly type = ActionTypes.SELECT_USER;
    constructor(public payload: any) {}
  }

  export class RemoveMsgAction implements Action {
    readonly type = ActionTypes.REMOVE_MSG;
    payload: string = null;
  }

  export type Actions =
    | AddUserAction
    | AddUserSuccessAction
    | AddUserFailAction
    | RemoveUserAction
    | RemoveUserSuccessAction
    | RemoveUserFailAction
    | LoadAction
    | LoadUserAction
    | SelectAction
    | SelectUserAction
    | RemoveMsgAction;
}