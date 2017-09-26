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

    case CountriesAction.ActionTypes.INITIALIZED: {
      const list = action.payload;
      return Object.assign({}, state, {
        countryList: list
      });
    }

    case CountriesAction.ActionTypes.LOAD_SUCCESS: {      
      const countries = action.payload;

      return Object.assign({}, state, {
        loaded: true,
        loading: false,
        entities: countries,
        ids: countries.map(country => country.id),
        currentCountryId: null,
        error: null
      });
    }

    case CountriesAction.ActionTypes.ADD_COUNTRY_SUCCESS: {
      const country = action.payload;

      if (state.ids.indexOf(country.id) > -1) {
        return {
          ...state,
          error: null
        }
      }

      return Object.assign({}, state, {
        ids: [...state.ids, country.id],
        error: null
      });
    }

    case CountriesAction.ActionTypes.REMOVE_COUNTRY_FAIL:
    case CountriesAction.ActionTypes.ADD_COUNTRY_FAIL:
    {     
      return {
        ...state,
        error: action.payload
      }
    }

    case CountriesAction.ActionTypes.REMOVE_COUNTRY_SUCCESS:
     {
      const country = action.payload;

      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== country.id),
          error: null

      });
    }

    default: {
      return state;
    }
  }
}

