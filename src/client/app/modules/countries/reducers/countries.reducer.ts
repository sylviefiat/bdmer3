import { CountriesAction, CountryAction } from '../actions/index';
import { ICountriesState, countriesInitialState } from '../states/index';
import { Country } from '../models/country';

export function countriesReducer(
  state: ICountriesState = countriesInitialState,
  action: CountriesAction.Actions | CountryAction.Actions
): ICountriesState {
  switch (action.type) {
    case CountriesAction.ActionTypes.LOAD: {
      return {
        ...state,
        loading: true,
      };
    }

    case CountriesAction.ActionTypes.INITIALIZED: {
      let list = action.payload;
      list = list.sort((c1,c2) => (c1.name<c2.name)?-1:((c1.name>c2.name)?1:0));
      return {
        ...state,
        countryList: list
      };
    }

    case CountriesAction.ActionTypes.LOAD_SUCCESS: {      
      const countries = action.payload;

      const newCountries = countries.filter(country => state.ids.includes(country._id)?false:country);

      const newCountryIds = newCountries.map(country => country._id);
      
      return {
        ...state,
        ids: [...state.ids, ...newCountryIds],
        entities: [...state.entities, ...newCountries]
      };
      
    }

    case CountriesAction.ActionTypes.ADD_COUNTRY_SUCCESS: {
      const country = action.payload;
        return {
          ...state,
          error: null
        }
    }

    case CountriesAction.ActionTypes.REMOVE_COUNTRY_SUCCESS:
     {
      const removedCountry = action.payload;
      return {
        ...state,
        entities: state.entities.filter(country => removedCountry._id!==country._id),
        ids: state.ids.filter(id => id !== removedCountry._id),
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

    case CountryAction.ActionTypes.ADD_USER_SUCCESS:
    case CountryAction.ActionTypes.REMOVE_USER_SUCCESS:
    {
      const updatedCountry = action.payload;
      const countries = state.entities.filter(country => (country._id===updatedCountry._id));
      const countryToUpdate=countries && countries[0];
      if((updatedCountry.users!==null && countryToUpdate.users===null) || (updatedCountry.users===null && countryToUpdate.users!==null) || (countryToUpdate.users.length!==updatedCountry.users.length)) {
        return {
          ...state,
          entities: [...state.entities.filter(country => updatedCountry._id!==country._id),...updatedCountry],
          error: null
        };
      } else {
        return state;  
      }
      
    }

    default: {
      return state;
    }
  }
}

