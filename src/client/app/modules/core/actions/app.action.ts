import { Action } from '@ngrx/store';
import { type } from '../../core/utils/index';
  
export namespace AppInitAction {

  export const APP: string = 'AppAction';

  export interface IAppInitActions {
    START_APP_INIT: string;
    FINISH_APP_INIT: string;
    LOAD_SERVICES_URL: string;
    SERVICES_URL_LOADED: string;
  }

  export const ActionTypes: IAppInitActions = {
    START_APP_INIT : type('[App] Start App Initializer'),
    FINISH_APP_INIT : type('[App] Finish App Initializer'),
    LOAD_SERVICES_URL : type('[App] Load services url'),
    SERVICES_URL_LOADED : type('[App] services url loaded')
  }

export class StartAppInitAction implements Action {
  readonly type = ActionTypes.START_APP_INIT;

  payload: string = null;
}

export class FinishAppInitAction implements Action {
  readonly type = ActionTypes.FINISH_APP_INIT;

  payload: string = null;
}

export class LoadServicesUrlAction implements Action {
  readonly type = ActionTypes.LOAD_SERVICES_URL;

  payload: string = null;
}

export class ServicesUrlLoadedAction implements Action {
  readonly type = ActionTypes.SERVICES_URL_LOADED;

  constructor(public payload: any) {}
}

export type Actions =
  | StartAppInitAction
  | FinishAppInitAction
  | LoadServicesUrlAction
  | ServicesUrlLoadedAction;
}