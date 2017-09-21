import { CountriesAction } from '../actions/index';
import { ICountriesState, countriesInitialState } from '../states/index';


export function countriesReducer(
  state: ICountriesState = countriesInitialState,
  action: CountriesAction.Actions
): ICountriesState {

  switch (action.type) {
    case CountriesAction.ActionTypes.LOAD: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case CountriesAction.ActionTypes.LOAD_SUCCESS: {      
      const countries = action.payload;

      return {
        loaded: true,
        loading: false,
        entities: countries,
        ids: countries.map(country => country.id),
        currentCountryId: null
      };
    }

    case CountriesAction.ActionTypes.ADD_COUNTRY_SUCCESS:
    case CountriesAction.ActionTypes.REMOVE_COUNTRY_FAIL: {
      const country = action.payload;

      if (state.ids.indexOf(country.id) > -1) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [...state.ids, country.id],
      });
    }

    case CountriesAction.ActionTypes.REMOVE_COUNTRY_SUCCESS:
    case CountriesAction.ActionTypes.ADD_COUNTRY_FAIL: {
      const country = action.payload;

      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== country.id),
      });
    }

    default: {
      return state;
    }
  }
}

