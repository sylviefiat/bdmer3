import { SpeciesAction } from "../actions/index";
import { ISpeciesState, speciesInitialState } from "../states/index";
import { Species } from "../models/species";

export function speciesReducer(state: ISpeciesState = speciesInitialState, action: SpeciesAction.Actions): ISpeciesState {
  //console.log(action.type);

  switch (action.type) {
    case SpeciesAction.ActionTypes.LOAD: {
      return {
        ...state,
        loading: true
      };
    }

    case SpeciesAction.ActionTypes.LOAD_SUCCESS: {
      const species = action.payload;

      const newSpecies = species.filter(species => (state.ids.includes(species._id) ? false : species));

      const newSpeciesIds = newSpecies.map(species => species._id);

      return {
        ...state,
        loading: false,
        loaded: true,
        entities: [...state.entities, ...newSpecies],
        ids: [...state.ids, ...newSpeciesIds],
        error: null
      };
    }

    case SpeciesAction.ActionTypes.ADD_SPECIES_SUCCESS:
    case SpeciesAction.ActionTypes.IMPORT_SPECIES_SUCCESS: {
      //console.log(action.payload);
      const addedspecies = action.payload;
      const otherspecies = state.entities.filter(species => addedspecies._id !== species._id);
      return {
        ...state,
        entities: [...otherspecies, ...addedspecies],
        ids: [...state.ids.filter(id => addedspecies._id !== id), ...addedspecies._id],
        error: null,
        msg: action.type === SpeciesAction.ActionTypes.IMPORT_SPECIES_SUCCESS ? "SPECIES_REGISTERED_SUCCESS" : null
      };
    }

    case SpeciesAction.ActionTypes.CHECK_SPECIES_ADD_ERROR: {
      if (action.payload.error) {
        return {
          ...state,
          error: action.payload.error,
          msg: null
        };
      } else {
        return {
          ...state
        };
      }
    }

    case SpeciesAction.ActionTypes.REMOVE_SPECIES_SUCCESS: {
      const removedSpecies = action.payload;
      return {
        ...state,
        entities: state.entities.filter(species => removedSpecies._id !== species._id),
        ids: state.ids.filter(id => id !== removedSpecies._id),
        currentSpeciesId: null,
        error: null,
        msg: "SPECIES_REMOVED_SUCCESS"
      };
    }

    case SpeciesAction.ActionTypes.REMOVE_SPECIES_FAIL:
    case SpeciesAction.ActionTypes.ADD_SPECIES_FAIL: {
      return {
        ...state,
        error: action.payload,
        msg: null
      };
    }

    case SpeciesAction.ActionTypes.SELECT: {
      //console.log(action.payload);
      return {
        ...state,
        currentSpeciesId: action.payload
      };
    }

    case SpeciesAction.ActionTypes.REMOVE_MSG: {
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
