import { Action } from '@ngrx/store';
import { Site,Zone, Transect } from '../models/index';
import { type } from '../../core/utils/index';
import { Observable } from 'rxjs/Observable';

export namespace SiteAction {
  // Category to uniquely identify the actions
  export const SITE: string = 'SiteAction';


  export interface ISiteActions {
      ADD_SITE: string;
      ADD_SITE_SUCCESS: string;
      ADD_SITE_FAIL: string;
      IMPORT_SITE: string;
      IMPORT_SITE_SUCCESS: string;
      REMOVE_SITE: string;
      REMOVE_SITE_SUCCESS: string;
      REMOVE_SITE_FAIL: string;
      ADD_ZONE: string;
      ADD_ZONE_SUCCESS: string;
      IMPORT_ZONE: string;
      IMPORT_ZONE_SUCCESS: string;
      REMOVE_ZONE: string;
      REMOVE_ZONE_SUCCESS: string;
      REMOVE_ZONE_FAIL: string;
      ADD_TRANSECT: string;
      ADD_TRANSECT_SUCCESS: string;
      IMPORT_TRANSECT: string;
      IMPORT_TRANSECT_SUCCESS: string;
      REMOVE_TRANSECT: string;
      REMOVE_TRANSECT_SUCCESS: string;
      REMOVE_TRANSECT_FAIL: string;
      LOAD: string;
      LOAD_SUCCESS: string;
      LOAD_FAIL: string;
      SELECT_SITE: string;
      SELECT_ZONE: string;
      SELECT_TRANSECT: string;
      SELECT_SP_PREF: string;
      SELECT_COUNT: string;
    }

    export const ActionTypes: ISiteActions = {
      ADD_SITE: type(`${SITE} Add Site`),
      ADD_SITE_SUCCESS: type(`${SITE} Add Site Success`),
      ADD_SITE_FAIL: type(`${SITE} Add Site Fail`),
      IMPORT_SITE: type(`${SITE} Import Site`),
      IMPORT_SITE_SUCCESS:type(`${SITE} Import Site Success`),
      REMOVE_SITE: type(`${SITE} Remove Site`),
      REMOVE_SITE_SUCCESS: type(`${SITE} Remove Site Success`),
      REMOVE_SITE_FAIL: type(`${SITE} Remove Site Fail`),
      ADD_ZONE: type(`${SITE} Add Zone`),
      ADD_ZONE_SUCCESS: type(`${SITE} Add Zone Success`),
      IMPORT_ZONE: type(`${SITE} Import Zone`),
      IMPORT_ZONE_SUCCESS:type(`${SITE} Import Zone Success`),
      REMOVE_ZONE: type(`${SITE} Remove Zone`),
      REMOVE_ZONE_SUCCESS: type(`${SITE} Remove Zone Success`),
      REMOVE_ZONE_FAIL: type(`${SITE} Remove Zone Fail`), 
      ADD_TRANSECT: type(`${SITE} Add Transect`),
      ADD_TRANSECT_SUCCESS: type(`${SITE} Add Transect Success`),
      IMPORT_TRANSECT: type(`${SITE} Import Transect`),
      IMPORT_TRANSECT_SUCCESS:type(`${SITE} Import Transect Success`),
      REMOVE_TRANSECT: type(`${SITE} Remove Transect`),
      REMOVE_TRANSECT_SUCCESS: type(`${SITE} Remove Transect Success`),
      REMOVE_TRANSECT_FAIL: type(`${SITE} Remove Transect Fail`),       
      LOAD: type(`${SITE} Load`),
      LOAD_SUCCESS: type(`${SITE} Load Success`),
      LOAD_FAIL: type(`${SITE} Load Fail`),
      SELECT_SITE: type(`${SITE} select site`),
      SELECT_ZONE: type(`${SITE} select zone`),
      SELECT_TRANSECT: type(`${SITE} select transect`),
      SELECT_SP_PREF: type(`${SITE} select species preference zone`),
      SELECT_COUNT: type(`${SITE} select count`)
    };

  /**
   * Add site to Site list Actions
   */
  export class AddSiteAction implements Action {
    readonly type = ActionTypes.ADD_SITE;

    constructor(public payload: Site) {}
  }

  export class AddSiteSuccessAction implements Action {
    readonly type = ActionTypes.ADD_SITE_SUCCESS;

    constructor(public payload: Site) {}
  }

  export class AddSiteFailAction implements Action {
    readonly type = ActionTypes.ADD_SITE_FAIL;

    constructor(public payload: any) {}
  }

  export class ImportSiteAction implements Action {
    readonly type = ActionTypes.IMPORT_SITE;

    constructor(public payload: any) {}
  }

  export class ImportSiteSuccessAction implements Action {
    readonly type = ActionTypes.IMPORT_SITE_SUCCESS;

    constructor(public payload: any) {}
  }

  /**
   * Remove site from Site list Actions
   */
  export class RemoveSiteAction implements Action {
    readonly type = ActionTypes.REMOVE_SITE;

    constructor(public payload: Site) {}
  }

  export class RemoveSiteSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_SITE_SUCCESS;

    constructor(public payload: Site) {}
  }

  export class RemoveSiteFailAction implements Action {
    readonly type = ActionTypes.REMOVE_SITE_FAIL;

    constructor(public payload: Site) {}
  }

  /**
   * Add zone to Site  Actions
   */
  export class AddZoneAction implements Action {
    readonly type = ActionTypes.ADD_ZONE;

    constructor(public payload: Zone) {}
  }

  export class AddZoneSuccessAction implements Action {
    readonly type = ActionTypes.ADD_ZONE_SUCCESS;

    constructor(public payload: Site) {}
  }

  export class ImportZoneAction implements Action {
    readonly type = ActionTypes.IMPORT_ZONE;

    constructor(public payload: any) {}
  }

  export class ImportZoneSuccessAction implements Action {
    readonly type = ActionTypes.IMPORT_ZONE_SUCCESS;

    constructor(public payload: Site) {}
  }

  /**
   * Remove zone from Site  Actions
   */
  export class RemoveZoneAction implements Action {
    readonly type = ActionTypes.REMOVE_ZONE;

    constructor(public payload: Zone) {}
  }

  export class RemoveZoneSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_ZONE_SUCCESS;

    constructor(public payload: Site) {}
  }

  export class RemoveZoneFailAction implements Action {
    readonly type = ActionTypes.REMOVE_ZONE_FAIL;

    constructor(public payload: Site) {}
  }


  /**
   * Add zone to Transect  Actions
   */
  export class AddTransectAction implements Action {
    readonly type = ActionTypes.ADD_TRANSECT;

    constructor(public payload: Transect) {}
  }

  export class AddTransectSuccessAction implements Action {
    readonly type = ActionTypes.ADD_TRANSECT_SUCCESS;

    constructor(public payload: Site) {}
  }

  export class ImportTransectAction implements Action {
    readonly type = ActionTypes.IMPORT_TRANSECT;

    constructor(public payload: any) {}
  }

  export class ImportTransectSuccessAction implements Action {
    readonly type = ActionTypes.IMPORT_TRANSECT_SUCCESS;

    constructor(public payload: Site) {}
  }

  /**
   * Remove Transect from Zone - Site  Actions
   */
  export class RemoveTransectAction implements Action {
    readonly type = ActionTypes.REMOVE_TRANSECT;

    constructor(public payload: Transect) {}
  }

  export class RemoveTransectSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_TRANSECT_SUCCESS;

    constructor(public payload: Site) {}
  }

  export class RemoveTransectFailAction implements Action {
    readonly type = ActionTypes.REMOVE_TRANSECT_FAIL;

    constructor(public payload: Site) {}
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
    constructor(public payload: Site[]) {}
  }

  export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;
    constructor(public payload: any) {}
  }

  export class SelectSiteAction implements Action {
    readonly type = ActionTypes.SELECT_SITE;
    constructor(public payload: any) {}
  }

  export class SelectZoneAction implements Action {
    readonly type = ActionTypes.SELECT_ZONE;
    constructor(public payload: any) {}
  }

  export class SelectTransectAction implements Action {
    readonly type = ActionTypes.SELECT_TRANSECT;
    constructor(public payload: any) {}
  }

  export class SelectSpPrefAction implements Action {
    readonly type = ActionTypes.SELECT_SP_PREF;
    constructor(public payload: any) {}
  }

  export class SelectCountAction implements Action {
    readonly type = ActionTypes.SELECT_COUNT;
    constructor(public payload: any) {}
  }

  export type Actions =
    | AddSiteAction
    | AddSiteSuccessAction
    | AddSiteFailAction
    | ImportSiteAction
    | RemoveSiteAction
    | RemoveSiteSuccessAction
    | RemoveSiteFailAction
    | AddZoneAction
    | AddZoneSuccessAction
    | ImportZoneAction
    | RemoveZoneAction
    | RemoveZoneSuccessAction
    | RemoveZoneFailAction
    | AddTransectAction
    | AddTransectSuccessAction
    | ImportTransectAction
    | RemoveTransectAction
    | RemoveTransectSuccessAction
    | RemoveTransectFailAction
    | LoadAction
    | LoadSuccessAction
    | LoadFailAction
    | SelectSiteAction
    | SelectZoneAction
    | SelectTransectAction
    | SelectSpPrefAction
    | SelectCountAction;
 }
