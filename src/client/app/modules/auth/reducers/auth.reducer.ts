import { IAuthState, authInitialState } from '../states/index';

import { AuthAction } from '../actions/index';
import { User } from '../models/user';

export function authReducer(
  state : IAuthState = authInitialState,
  action: AuthAction.Actions
): IAuthState {
  switch (action.type) {
    case AuthAction.ActionTypes.LOGIN_SUCCESS: {      
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
      };
    }

    case AuthAction.ActionTypes.LOGOUT: {
      return authInitialState;
    }

    default: {
      return state;
    }
  }
}

