import { Action } from '@ngrx/store';
import { Authenticate } from '../models/user';
import { User } from '../../countries/models/country';
import { type } from '../../core/utils/index';
  
export namespace AuthAction {

  export const AUTH: string = 'AuthAction';

  export interface IAuthActions {
    LOGIN: string;
    LOGOUT: string;
    LOST_PASSWORD: string;
    LOGIN_SUCCESS: string;
    LOGIN_FAILURE: string;
    LOGIN_REDIRECT: string;
    LOST_PASSWORD_SUCCESS: string;
    LOST_PASSWORD_FAILURE: string;
    LOST_PASSWORD_REDIRECT: string;
  }

  export const ActionTypes: IAuthActions = {
    LOGIN : type('[Auth] Login'),
    LOGOUT : type('[Auth] Logout'),
    LOST_PASSWORD : type('[Auth] Lost password'),
    LOGIN_SUCCESS : type('[Auth] Login Success'),
    LOGIN_FAILURE : type('[Auth] Login Failure'),
    LOGIN_REDIRECT : type('[Auth] Login Redirect'),
    LOST_PASSWORD_SUCCESS : type('[Auth] Lost password Success'),
    LOST_PASSWORD_FAILURE : type('[Auth] Lost password Failure'),
    LOST_PASSWORD_REDIRECT : type('[Auth] Lost password Redirect')
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
  
  constructor(public payload: any) {}
}

export class LostPassword implements Action {
  readonly type = ActionTypes.LOST_PASSWORD;

  constructor(public payload: string) {}
}

export class LostPasswordSuccess implements Action {
  readonly type = ActionTypes.LOST_PASSWORD_SUCCESS;

  constructor(public payload: { user: User }) {}
}

export class LostPasswordFailure implements Action {
  readonly type = ActionTypes.LOST_PASSWORD_FAILURE;

  constructor(public payload: any) {}
}

export class LostPasswordRedirect implements Action {
  readonly type = ActionTypes.LOST_PASSWORD_REDIRECT;
  payload: string = null;
}

export type Actions =
  | Login
  | LoginSuccess
  | LoginFailure
  | LoginRedirect
  | LostPassword
  | LostPasswordSuccess
  | LostPasswordFailure
  | LostPasswordRedirect
  | Logout;
}