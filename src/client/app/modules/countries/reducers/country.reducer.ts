import { CountryAction } from '../actions/index';
import { ICountryState, countryInitialState } from '../states/index';

export function countryReducer(
  state: ICountryState = countryInitialState,
  action: CountryAction.Actions
): ICountryState {

  switch (action.type) {

    case CountryAction.ActionTypes.ADD_USER_SUCCESS: {
      const country = action.payload;
      return {
        ...state,
        msg: "User saved with success"
      };
    }

    case CountryAction.ActionTypes.REMOVE_USER_SUCCESS: {
      const country = action.payload;
      return {
        ...state,
        msg: "User removed with success"
      };
    }

    case CountryAction.ActionTypes.REMOVE_USER_FAIL:
    case CountryAction.ActionTypes.ADD_USER_FAIL: {
      const user = action.payload;

      return {
        ...state,
        error: action.payload
      };
    }

    case CountryAction.ActionTypes.SELECT: {
      return {
        ...state,
        currentCountryId: action.payload,
      };
    }

    case CountryAction.ActionTypes.SELECT_USER: {
      return {
        ...state,
        currentUserId: action.payload,
      };
    }


    case CountryAction.ActionTypes.REMOVE_MSG: {
      return {
        ...state,
        error: null,
        msg: null
      };
    }


    default: {
      return state;
    }
  }
}

