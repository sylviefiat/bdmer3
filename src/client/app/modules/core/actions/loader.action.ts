import { Action } from '@ngrx/store';
import { type } from '../../core/utils/index';
  
export namespace LoaderAction {

  export const APP: string = 'LoaderAction';

  export interface ILoaderActions {
    LOADING: string;
    LOADED: string;
  }

  export const ActionTypes: ILoaderActions = {
    LOADING : type('[App] Loader loading'),
    LOADED : type('[App] Loader loaded')
  }

export class LoadingAction implements Action {
  readonly type = ActionTypes.LOADING;

  payload: string = null;
}

export class LoadedAction implements Action {
  readonly type = ActionTypes.LOADED;

  payload: string = null;
}

export type Actions =
  | LoadingAction
  | LoadedAction;
}