import { Action } from '@ngrx/store';
import { Site,Zone } from '../models/index';
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
      LOAD: string;
      LOAD_SUCCESS: string;
      LOAD_FAIL: string;
      SELECT: string;
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
      LOAD: type(`${SITE} Load`),
      LOAD_SUCCESS: type(`${SITE} Load Success`),
      LOAD_FAIL: type(`${SITE} Load Fail`),
      SELECT: type(`${SITE}  select`)
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

    constructor(public payload: {site:Site,zone:Zone}) {}
  }

  export class AddZoneSuccessAction implements Action {
    readonly type = ActionTypes.ADD_ZONE_SUCCESS;

    constructor(public payload: Site) {}
  }

  export class ImportZoneAction implements Action {
    readonly type = ActionTypes.IMPORT_ZONE;

    constructor(public payload: {site:Observable<Site>,zone:Zone}) {}
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

    constructor(public payload: {site:Site, zone: Zone}) {}
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

  export class SelectAction implements Action {
    readonly type = ActionTypes.SELECT;
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
    | LoadAction
    | LoadSuccessAction
    | LoadFailAction
    | SelectAction;
 }
