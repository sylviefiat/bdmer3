import { CountriesAction } from '../actions/index';
import { ICountriesState, countriesInitialState } from '../states/index';
import { Country } from '../models/country';

export function countriesReducer(
  state: ICountriesState = countriesInitialState,
  action: CountriesAction.Actions
): ICountriesState {
console.log(action.type);
  switch (action.type) {
    case CountriesAction.ActionTypes.LOAD: {
      return {
        ...state,
        loading: true,
      };
    }

    case CountriesAction.ActionTypes.INITIALIZED: {
      const list = action.payload;
      return {
        ...state,
        countryList: list
      };
    }

    case CountriesAction.ActionTypes.LOAD_SUCCESS: {      
      const countries = action.payload;
      const newCountries = countries.filter(country => !state.entities[country.id]);

      const newCountryIds = newCountries.map(country => country.id);
      const newCountryEntities = newCountries.reduce(
        (entities: { [id: string]: Country }, country: Country) => {
          return Object.assign(entities, {
            [country._id]: country,
          });
        },
        {}
      );
      console.log(Object.assign({}, state.entities, newCountryEntities));
      return {
        ...state,
        ids: [...state.ids, ...newCountryIds],
        entities: Object.assign({}, state.entities, newCountryEntities)
      };
      /*console.log(countries);
      return {
        ...state,
        loaded: true,
        loading: false,
        entities: countries,
        ids: countries.map(country => country.code),
        currentCountryId: null,
        error: null
      };*/
    }

    case CountriesAction.ActionTypes.ADD_COUNTRY_SUCCESS: {
      const country = action.payload;
      //console.log(country);
      if (state.ids.indexOf(country.id) > -1) {
        return {
          ...state,
          error: null
        }
      }

      return {
        ...state,
        ids: [...state.ids, country.id],
        error: null
      };
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

      return {
        ...state,
        ids: state.ids.filter(id => id !== country.id),
          error: null

      };
    }

    default: {
      return state;
    }
  }
}

