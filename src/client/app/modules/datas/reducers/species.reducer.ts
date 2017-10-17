import { SpeciesAction } from '../actions/index';
import { ISpeciesState, speciesInitialState } from '../states/index';
import { Species } from '../models/species';

export function speciesReducer(
  state: ISpeciesState = speciesInitialState,
  action: SpeciesAction.Actions
): ISpeciesState {
  switch (action.type) {
      default: {
      return state;
    }
  }
}