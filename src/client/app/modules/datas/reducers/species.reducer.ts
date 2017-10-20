import { SpeciesAction } from '../actions/index';
import { ISpeciesState, speciesInitialState } from '../states/index';
import { Species } from '../models/species';

export function speciesReducer(
    state: ISpeciesState = speciesInitialState,
    action: SpeciesAction.Actions
): ISpeciesState {
    //console.log(action.type);

    switch (action.type) {
        case SpeciesAction.ActionTypes.LOAD: {
            return {
                ...state,
                loading: true,
            };
        }

        case SpeciesAction.ActionTypes.LOAD_SUCCESS: {
            const species = action.payload;

            const newSpecies = species.filter(species => state.ids.includes(species._id) ? false : species);

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

        case SpeciesAction.ActionTypes.ADD_SPECIES_SUCCESS: {
            const addedspecies = action.payload;
            console.log(addedspecies);
            return {
                ...state,
                entities: [...state.entities.filter(species => addedspecies._id !== species._id),addedspecies],
                error: null
            }
        }

        case SpeciesAction.ActionTypes.REMOVE_SPECIES_SUCCESS:
            {
                const removedSpecies = action.payload;
                return {
                    ...state,
                    entities: state.entities.filter(species => removedSpecies._id !== species._id),
                    ids: state.ids.filter(id => id !== removedSpecies._id),
                    currentSpeciesId: null,
                    error: null
                };
            }

        case SpeciesAction.ActionTypes.REMOVE_SPECIES_FAIL:
        case SpeciesAction.ActionTypes.ADD_SPECIES_FAIL:
            {
                return {
                    ...state,
                    error: action.payload
                }
            }

        case SpeciesAction.ActionTypes.SELECT: {
            console.log(action.payload);
            return {
                ...state,
                currentSpeciesId: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}