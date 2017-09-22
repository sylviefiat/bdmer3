import { Action } from '@ngrx/store';
import { Authenticate } from '../models/user';
import { User } from '../../countries/models/country';
import { type } from '../../core/utils/index';
  
export namespace AuthAction {

  export const AUTH: string = 'AuthAction';

  export interface IAuthActions {
    LOGIN: string;
    LOGOUT: string;
    SIGNUP: string;
    LOGIN_SUCCESS: string;
    LOGIN_FAILURE: string;
    LOGIN_REDIRECT: string;
    SIGNUP_SUCCESS: string;
    SIGNUP_FAILURE: string;
    SIGNUP_REDIRECT: string;
  }

  export const ActionTypes: IAuthActions = {
    LOGIN : type('[Auth] Login'),
    LOGOUT : type('[Auth] Logout'),
    SIGNUP : type('[Auth] Signup'),
    LOGIN_SUCCESS : type('[Auth] Login Success'),
    LOGIN_FAILURE : type('[Auth] Login Failure'),
    LOGIN_REDIRECT : type('[Auth] Login Redirect'),
    SIGNUP_SUCCESS : type('[Auth] Signup Success'),
    SIGNUP_FAILURE : type('[Auth] Signup Failure'),
    SIGNUP_REDIRECT : type('[Auth] Signup Redirect')
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

export class Signup implements Action {
  readonly type = ActionTypes.SIGNUP;

  constructor(public payload: Authenticate) {}
}

export class SignupSuccess implements Action {
  readonly type = ActionTypes.SIGNUP_SUCCESS;

  constructor(public payload: { user: User }) {}
}

export class SignupFailure implements Action {
  readonly type = ActionTypes.SIGNUP_FAILURE;

  constructor(public payload: any) {}
}

export class SignupRedirect implements Action {
  readonly type = ActionTypes.SIGNUP_REDIRECT;
  payload: string = null;
}

export type Actions =
  | Login
  | LoginSuccess
  | LoginFailure
  | LoginRedirect
  | Signup
  | SignupSuccess
  | SignupFailure
  | SignupRedirect
  | Logout;
}