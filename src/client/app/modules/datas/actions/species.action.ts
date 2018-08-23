import { Action } from "@ngrx/store";
import { Species } from "../models/species";
import { type } from "../../core/utils/index";

export namespace SpeciesAction {
  // Category to uniquely identify the actions
  export const SPECIES: string = "SpeciesAction";

  export interface ISpeciesActions {
    ADD_SPECIES: string;
    ADD_SPECIES_SUCCESS: string;
    ADD_SPECIES_FAIL: string;
    IMPORT_SPECIES: string;
    IMPORT_SPECIES_SUCCESS: string;
    REMOVE_SPECIES: string;
    REMOVE_SPECIES_SUCCESS: string;
    REMOVE_SPECIES_FAIL: string;
    CHECK_SPECIES_CSV_FILE: string;
    CHECK_SPECIES_ADD_ERROR: string;
    CHECK_SPECIES_SUCCESS: string;
    LOAD: string;
    LOAD_SUCCESS: string;
    LOAD_FAIL: string;
    SELECT: string;
    REMOVE_MSG: string;
  }

  export const ActionTypes: ISpeciesActions = {
    ADD_SPECIES: type(`${SPECIES} Add Species`),
    ADD_SPECIES_SUCCESS: type(`${SPECIES} Add Species Success`),
    ADD_SPECIES_FAIL: type(`${SPECIES} Add Species Fail`),
    IMPORT_SPECIES: type(`${SPECIES} Import Species`),
    IMPORT_SPECIES_SUCCESS: type(`${SPECIES} Import Species Success`),
    REMOVE_SPECIES: type(`${SPECIES} Remove Species`),
    REMOVE_SPECIES_SUCCESS: type(`${SPECIES} Remove Species Success`),
    REMOVE_SPECIES_FAIL: type(`${SPECIES} Remove Species Fail`),
    CHECK_SPECIES_CSV_FILE: type(`${SPECIES} Check Species Csv file`),
    CHECK_SPECIES_ADD_ERROR: type(`${SPECIES} Check Species Csv file add error`),
    CHECK_SPECIES_SUCCESS: type(`${SPECIES} Check Species Csv file success`),
    LOAD: type(`${SPECIES} Load`),
    LOAD_SUCCESS: type(`${SPECIES} Load Success`),
    LOAD_FAIL: type(`${SPECIES} Load Fail`),
    SELECT: type(`${SPECIES}  select`),
    REMOVE_MSG: type(`${SPECIES} remove message`)
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

    constructor(public payload: any) {}
  }

  export class ImportSpeciesAction implements Action {
    readonly type = ActionTypes.IMPORT_SPECIES;

    constructor(public payload: any) {}
  }

  export class ImportSpeciesSuccessAction implements Action {
    readonly type = ActionTypes.IMPORT_SPECIES_SUCCESS;

    constructor(public payload: any) {}
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

  export class RemoveMsgAction implements Action {
    readonly type = ActionTypes.REMOVE_MSG;
    payload: string = null;
  }

  export class CheckSpeciesCsvFile implements Action {
    readonly type = ActionTypes.CHECK_SPECIES_CSV_FILE;

    constructor(public payload: any) {}
  }

  export class CheckSpeciesAddErrorAction implements Action {
    readonly type = ActionTypes.CHECK_SPECIES_ADD_ERROR;

    constructor(public payload: string) {}
  }

  export class CheckSpeciesSuccessAction implements Action {
    readonly type = ActionTypes.CHECK_SPECIES_SUCCESS;

    constructor(public payload: any) {}
  }

  export class SelectAction implements Action {
    readonly type = ActionTypes.SELECT;
    constructor(public payload: any) {}
  }

  export type Actions =
    | AddSpeciesAction
    | AddSpeciesSuccessAction
    | AddSpeciesFailAction
    | ImportSpeciesAction
    | RemoveSpeciesAction
    | RemoveSpeciesSuccessAction
    | RemoveSpeciesFailAction
    | LoadAction
    | LoadSuccessAction
    | LoadFailAction
    | SelectAction
    | RemoveMsgAction;
}
