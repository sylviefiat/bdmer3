import { Action } from '@ngrx/store';
import { User, Authenticate } from '../models/user';
import { type } from '../../core/utils/index';
  
export namespace AuthAction {

  export const AUTH: string = 'AuthAction';

  export interface IAuthActions {
    LOGIN: string;
    LOGOUT: string;
    LOGIN_SUCCESS: string;
    LOGIN_FAILURE: string;
    LOGIN_REDIRECT: string;
  }

  export const ActionTypes: IAuthActions = {
    LOGIN : type('[Auth] Login'),
    LOGOUT : type('[Auth] Logout'),
    LOGIN_SUCCESS : type('[Auth] Login Success'),
    LOGIN_FAILURE : type('[Auth] Login Failure'),
    LOGIN_REDIRECT : type('[Auth] Login Redirect')
  }
export class Login implements Action {
  readonly type = ActionTypes.LOGIN;

  constructor(public payload: Authenticate) {}
}

export class LoginSuccess implements Action {
  readonly type = ActionTypes.LOGIN_SUCCESS;

  constructor(public payload: { user: User }) {}
}

export class LoginFailure implements Action {
  readonly type = ActionTypes.LOGIN_FAILURE;

  constructor(public payload: any) {}
}

export class LoginRedirect implements Action {
  readonly type = ActionTypes.LOGIN_REDIRECT;
  payload: string = null;
}

export class Logout implements Action {
  readonly type = ActionTypes.LOGOUT;
  payload: string = null;
}

export type Actions =
  | Login
  | LoginSuccess
  | LoginFailure
  | LoginRedirect
  | Logout;
}