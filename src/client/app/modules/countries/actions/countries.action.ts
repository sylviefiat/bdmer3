import { Action } from '@ngrx/store';
import { Country } from '../models/country';
import { type } from '../../core/utils/index';

export namespace CountriesAction {

  export const COUNTRIES: string = 'CountriesAction';

  export interface ICountriesActions {
    ADD_COUNTRY: string;
    ADD_COUNTRY_SUCCESS: string;
    ADD_COUNTRY_FAIL: string;
    REMOVE_COUNTRY: string;
    REMOVE_COUNTRY_SUCCESS: string;
    REMOVE_COUNTRY_FAIL: string;
    INIT: string;
    INITIALIZED: string;
    INIT_FAILED: string;
    LOAD: string;
    LOAD_SUCCESS: string;
    LOAD_FAIL: string;
  }

  export const ActionTypes: ICountriesActions = {
    ADD_COUNTRY: type(`${COUNTRIES} Add country`),
    ADD_COUNTRY_SUCCESS: type(`${COUNTRIES} Add country Success`),
    ADD_COUNTRY_FAIL: type(`${COUNTRIES} Add country Fail`),
    REMOVE_COUNTRY: type(`${COUNTRIES} Remove country`),
    REMOVE_COUNTRY_SUCCESS: type(`${COUNTRIES} Remove country Success`),
    REMOVE_COUNTRY_FAIL: type(`${COUNTRIES} Remove country Fail`),
    INIT: type(`${COUNTRIES} Init list`),
    INITIALIZED: type(`${COUNTRIES} list Initialized`),
    INIT_FAILED: type(`${COUNTRIES} list Init Failed`),
    LOAD: type(`${COUNTRIES} Load`),
    LOAD_SUCCESS: type(`${COUNTRIES} Load Success`),
    LOAD_FAIL: type(`${COUNTRIES} Load Fail`)
  };

  /**
   * Every action is comprised of at least a type and an optional
   * payload. Expressing actions as classes enables powerful
   * type checking in reducer functions.
   *
   * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
   */
  /**
   * Add Country to Countries Actions
   */
  export class AddCountryAction implements Action {
    readonly type = ActionTypes.ADD_COUNTRY;

    constructor(public payload: Country) {}
  }

  export class AddCountrySuccessAction implements Action {
    readonly type = ActionTypes.ADD_COUNTRY_SUCCESS;

    constructor(public payload: Country) {}
  }

  export class AddCountryFailAction implements Action {
    readonly type = ActionTypes.ADD_COUNTRY_FAIL;

    constructor(public payload: any) {}
  }

  /**
   * Remove Country from Countries Actions
   */
  export class RemoveCountryAction implements Action {
    readonly type = ActionTypes.REMOVE_COUNTRY;

    constructor(public payload: Country) {}
  }

  export class RemoveCountrySuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_COUNTRY_SUCCESS;

    constructor(public payload: Country) {}
  }

  export class RemoveCountryFailAction implements Action {
    readonly type = ActionTypes.REMOVE_COUNTRY_FAIL;

    constructor(public payload: any) {}
  }

  export class InitAction implements Action {
    type = ActionTypes.INIT;
    payload: string = null;
  }

  export class InitializedAction implements Action {
    type = ActionTypes.INITIALIZED;

    constructor(public payload: any) { }
  }

  export class InitFailedAction implements Action {
    type = ActionTypes.INIT_FAILED;
    payload: string = null;
  }

  /**
   * Load Countries Actions
   */
  export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;
    payload: string = null;
  }

  export class LoadSuccessAction implements Action {
    readonly type = ActionTypes.LOAD_SUCCESS;
    constructor(public payload: Country[]) {}
  }

  export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;
    constructor(public payload: any) {}
  }

  export type Actions =
    | AddCountryAction
    | AddCountrySuccessAction
    | AddCountryFailAction
    | RemoveCountryAction
    | RemoveCountrySuccessAction
    | RemoveCountryFailAction
    | LoadAction
    | LoadSuccessAction
    | LoadFailAction;
}
