import { CountryAction } from '../actions/index';
import { ICountryState, countryInitialState } from '../states/index';


export function countryReducer(
  state: ICountryState = countryInitialState,
  action: CountryAction.Actions
): ICountryState {
  
  switch (action.type) { 

    case CountryAction.ActionTypes.ADD_USER_SUCCESS:
    case CountryAction.ActionTypes.REMOVE_USER_SUCCESS: {
      const country = action.payload;
      return state;
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
      console.log("select country:" +action.payload);
      return {
        ...state,
        currentCountryId: action.payload,
      };
    }


    default: {
      return state;
    }
  }
}

