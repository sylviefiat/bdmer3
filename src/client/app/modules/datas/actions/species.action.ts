import { Action } from '@ngrx/store';
import { Species, Dimensions } from '../models/species';
import { type } from '../../core/utils/index';

export namespace SpeciesAction {
  // Category to uniquely identify the actions
  export const SPECIES: string = 'SpeciesAction';


  export interface ISpeciesActions {
      ADD_SPECIES: string;
      ADD_SPECIES_SUCCESS: string;
      ADD_SPECIES_FAIL: string;
      REMOVE_SPECIES: string;
      REMOVE_SPECIES_SUCCESS: string;
      REMOVE_SPECIES_FAIL: string;
      LOAD: string;
      LOAD_SUCCESS: string;
      LOAD_FAIL: string;
    }

    export const ActionTypes: ISpeciesActions = {
      ADD_SPECIES: type(`${SPECIES} Add Species`),
      ADD_SPECIES_SUCCESS: type(`${SPECIES} Add Species Success`),
      ADD_SPECIES_FAIL: type(`${SPECIES} Add Species Fail`),
      REMOVE_SPECIES: type(`${SPECIES} Remove Species`),
      REMOVE_SPECIES_SUCCESS: type(`${SPECIES} Remove Species Success`),
      REMOVE_SPECIES_FAIL: type(`${SPECIES} Remove Species Fail`),
      LOAD: type(`${SPECIES} Load`),
      LOAD_SUCCESS: type(`${SPECIES} Load Success`),
      LOAD_FAIL: type(`${SPECIES} Load Fail`)
    };

  /**
   * Add species to Species list Actions
   */
  export class AddSpeciesAction implements Action {
    readonly type = ActionTypes.ADD_SPECIES;

    constructor(public payload: Species) {}
  }

  export class AddSpeciesSuccessAction implements Action {
    readonly type = ActionTypes.ADD_SPECIES_SUCCESS;

    constructor(public payload: Species) {}
  }

  export class AddSpeciesFailAction implements Action {
    readonly type = ActionTypes.ADD_SPECIES_FAIL;

    constructor(public payload: Species) {}
  }

  /**
   * Remove species from Species list Actions
   */
  export class RemoveSpeciesAction implements Action {
    readonly type = ActionTypes.REMOVE_SPECIES;

    constructor(public payload: Species) {}
  }

  export class RemoveSpeciesSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_SPECIES_SUCCESS;

    constructor(public payload: Species) {}
  }

  export class RemoveSpeciesFailAction implements Action {
    readonly type = ActionTypes.REMOVE_SPECIES_FAIL;

    constructor(public payload: Species) {}
  }

  /**
   * Load Collection Actions
   */
  export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;
    payload: string = null;
  }

  export class LoadSuccessAction implements Action {    
    readonly type = ActionTypes.LOAD_SUCCESS;
    constructor(public payload: Species[]) {}
  }

  export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;
    constructor(public payload: any) {}
  }

  export type Actions =
    | AddSpeciesAction
    | AddSpeciesSuccessAction
    | AddSpeciesFailAction
    | RemoveSpeciesAction
    | RemoveSpeciesSuccessAction
    | RemoveSpeciesFailAction
    | LoadAction
    | LoadSuccessAction
    | LoadFailAction;
 }
