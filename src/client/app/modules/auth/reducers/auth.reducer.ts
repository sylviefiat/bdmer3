import { IAuthState, authInitialState } from '../states/index';

import { AuthAction } from '../actions/index';
import { User } from '../../countries/models/country';

export function authReducer(
  state : IAuthState = authInitialState,
  action: AuthAction.Actions
): IAuthState {
  //console.log(action.type);
  switch (action.type) {
    case AuthAction.ActionTypes.LOGIN_SUCCESS: {  
      console.log(action.payload);
      return {
        ...state,
        loggedIn: true,
        role: action.payload.access_token.user.role,
        user: action.payload.access_token.user,
        country: action.payload.access_token.country,
        sessionLoaded: true
      };
    }

    case AuthAction.ActionTypes.LOGIN_FAILURE: {  
      console.log(action.payload);
      return {
        ...state,
        loggedIn: false,
        sessionLoaded: true
      };
    }


    case AuthAction.ActionTypes.LOGIN_REDIRECT: {  
      console.log(action.payload);
      return {
        ...state,
        latestURL: action.payload
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

