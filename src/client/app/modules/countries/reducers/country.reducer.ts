import { CountryAction } from '../actions/index';
import { ICountryState, countryInitialState } from '../states/index';


export function countryReducer(
  state: ICountryState = countryInitialState,
  action: CountryAction.Actions
): ICountryState {
  console.log(action.type);
  switch (action.type) { 

    case CountryAction.ActionTypes.ADD_USER_SUCCESS:
    case CountryAction.ActionTypes.REMOVE_USER_SUCCESS: {
      const country = action.payload;
      console.log(country);

      /*if (state.userIds.indexOf(user.id) > -1) {
        return state;
      }*/

      return state;/*{
        ...state,
        userIds: [...state.userIds, user.id],
      };*/
    }

    case CountryAction.ActionTypes.REMOVE_USER_FAIL:
    case CountryAction.ActionTypes.ADD_USER_FAIL: {
      const user = action.payload;

      return {
        ...state,
        error: action.payload,
        //userIds: state.userIds && state.userIds.filter(id => id !== user.id),
      };
    }

    case CountryAction.ActionTypes.SELECT: {
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

