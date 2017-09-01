import { ILoginPageState, loginPageInitialState } from '../states/index';

import { AuthAction } from '../actions/index';

export function loginPageReducer(state = loginPageInitialState, action: AuthAction.Actions): ILoginPageState {
  //console.log(action.type);
  switch (action.type) {
    case AuthAction.ActionTypes.LOGIN: {
      console.log(action.type);
      return {
        ...state,
        error: null,
        pending: true,
      };
    }

    case AuthAction.ActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        error: null,
        pending: false,
      };
    }

    case AuthAction.ActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        error: action.payload,
        pending: false,
      };
    }

    default: {
      return state;
    }
  }
}

