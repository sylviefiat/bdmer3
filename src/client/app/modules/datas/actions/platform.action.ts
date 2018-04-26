import { Action } from '@ngrx/store';
import { Platform,Zone, Transect, ZonePreference,Count,Survey } from '../models/index';
import { type } from '../../core/utils/index';
import { Observable } from 'rxjs/Observable';

export namespace PlatformAction {
  // Category to uniquely identify the actions
  export const PLATFORM: string = 'PlatformAction';


  export interface IPlatformActions {
      ADD_PLATFORM: string;
      ADD_PLATFORM_SUCCESS: string;
      ADD_PLATFORM_FAIL: string;
      IMPORT_PLATFORM: string;
      IMPORT_PLATFORM_SUCCESS: string;
      REMOVE_PLATFORM: string;
      REMOVE_PLATFORM_SUCCESS: string;
      REMOVE_PLATFORM_FAIL: string;
      ADD_ZONE: string;
      ADD_ZONE_SUCCESS: string;
      ADD_ZONE_FAIL: string;
      IMPORT_ZONE: string;
      IMPORT_ZONE_SUCCESS: string;
      REMOVE_ZONE: string;
      REMOVE_ZONE_SUCCESS: string;
      REMOVE_ZONE_FAIL: string;
      ADD_SURVEY: string;
      ADD_SURVEY_SUCCESS: string;
      IMPORT_SURVEY: string;
      IMPORT_SURVEY_SUCCESS: string;
      REMOVE_SURVEY: string;
      REMOVE_SURVEY_SUCCESS: string;
      REMOVE_SURVEY_FAIL: string;
      ADD_TRANSECT: string;
      ADD_TRANSECT_SUCCESS: string;
      IMPORT_TRANSECT: string;
      IMPORT_TRANSECT_SUCCESS: string;
      REMOVE_TRANSECT: string;
      REMOVE_TRANSECT_SUCCESS: string;
      REMOVE_TRANSECT_FAIL: string;
      ADD_ZONE_PREF: string;
      ADD_ZONE_PREF_SUCCESS: string;
      IMPORT_ZONE_PREF: string;
      IMPORT_ZONE_PREF_SUCCESS: string;
      REMOVE_ZONE_PREF: string;
      REMOVE_ZONE_PREF_SUCCESS: string;
      REMOVE_ZONE_PREF_FAIL: string;
      ADD_COUNT: string;
      ADD_COUNT_SUCCESS: string;
      IMPORT_COUNT: string;
      IMPORT_COUNT_SUCCESS: string;
      REMOVE_COUNT: string;
      REMOVE_COUNT_SUCCESS: string;
      REMOVE_COUNT_FAIL: string;
      LOAD: string;
      LOAD_SUCCESS: string;
      LOAD_FAIL: string;
      SELECT_PLATFORM: string;
      SELECT_ZONE: string;
      SELECT_SURVEY: string;
      SELECT_TRANSECT: string;
      SELECT_ZONE_PREF: string;
      SELECT_COUNT: string;
      REMOVE_MSG: string;
    }

    export const ActionTypes: IPlatformActions = {
      ADD_PLATFORM: type(`${PLATFORM} Add Platform`),
      ADD_PLATFORM_SUCCESS: type(`${PLATFORM} Add Platform Success`),
      ADD_PLATFORM_FAIL: type(`${PLATFORM} Add Platform Fail`),
      IMPORT_PLATFORM: type(`${PLATFORM} Import Platform`),
      IMPORT_PLATFORM_SUCCESS:type(`${PLATFORM} Import Platform Success`),
      REMOVE_PLATFORM: type(`${PLATFORM} Remove Platform`),
      REMOVE_PLATFORM_SUCCESS: type(`${PLATFORM} Remove Platform Success`),
      REMOVE_PLATFORM_FAIL: type(`${PLATFORM} Remove Platform Fail`),
      ADD_ZONE: type(`${PLATFORM} Add Zone`),
      ADD_ZONE_SUCCESS: type(`${PLATFORM} Add Zone Success`),
      ADD_ZONE_FAIL: type(`${PLATFORM} Add Zone Fail`),
      IMPORT_ZONE: type(`${PLATFORM} Import Zone`),
      IMPORT_ZONE_SUCCESS:type(`${PLATFORM} Import Zone Success`),
      REMOVE_ZONE: type(`${PLATFORM} Remove Zone`),
      REMOVE_ZONE_SUCCESS: type(`${PLATFORM} Remove Zone Success`),
      REMOVE_ZONE_FAIL: type(`${PLATFORM} Remove Zone Fail`), 
      ADD_TRANSECT: type(`${PLATFORM} Add Transect`),
      ADD_TRANSECT_SUCCESS: type(`${PLATFORM} Add Transect Success`),
      IMPORT_TRANSECT: type(`${PLATFORM} Import Transect`),
      IMPORT_TRANSECT_SUCCESS:type(`${PLATFORM} Import Transect Success`),
      REMOVE_TRANSECT: type(`${PLATFORM} Remove Transect`),
      REMOVE_TRANSECT_SUCCESS: type(`${PLATFORM} Remove Transect Success`),
      REMOVE_TRANSECT_FAIL: type(`${PLATFORM} Remove Transect Fail`), 
      ADD_SURVEY: type(`${PLATFORM} Add Survey`),
      ADD_SURVEY_SUCCESS: type(`${PLATFORM} Add Survey Success`),
      IMPORT_SURVEY: type(`${PLATFORM} Import Survey`),
      IMPORT_SURVEY_SUCCESS:type(`${PLATFORM} Import Survey Success`),
      REMOVE_SURVEY: type(`${PLATFORM} Remove Survey`),
      REMOVE_SURVEY_SUCCESS: type(`${PLATFORM} Remove Survey Success`),
      REMOVE_SURVEY_FAIL: type(`${PLATFORM} Remove Survey Fail`),   
      ADD_ZONE_PREF: type(`${PLATFORM} Add Zone Preference`),
      ADD_ZONE_PREF_SUCCESS: type(`${PLATFORM} Add Zone Preference Success`),
      IMPORT_ZONE_PREF: type(`${PLATFORM} Import Zone Preference`),
      IMPORT_ZONE_PREF_SUCCESS:type(`${PLATFORM} Import Zone Preference Success`),
      REMOVE_ZONE_PREF: type(`${PLATFORM} Remove Zone Preference`),
      REMOVE_ZONE_PREF_SUCCESS: type(`${PLATFORM} Remove Zone Preference Success`),
      REMOVE_ZONE_PREF_FAIL: type(`${PLATFORM} Remove Zone Preference Fail`),  
      ADD_COUNT: type(`${PLATFORM} Add Count`),
      ADD_COUNT_SUCCESS: type(`${PLATFORM} Add Count Success`),
      IMPORT_COUNT: type(`${PLATFORM} Import Count`),
      IMPORT_COUNT_SUCCESS:type(`${PLATFORM} Import Count Success`),
      REMOVE_COUNT: type(`${PLATFORM} Remove Count`),
      REMOVE_COUNT_SUCCESS: type(`${PLATFORM} Remove Count Success`),
      REMOVE_COUNT_FAIL: type(`${PLATFORM} Remove Count Fail`),       
      LOAD: type(`${PLATFORM} Load`),
      LOAD_SUCCESS: type(`${PLATFORM} Load Success`),
      LOAD_FAIL: type(`${PLATFORM} Load Fail`),
      SELECT_PLATFORM: type(`${PLATFORM} select platform`),
      SELECT_ZONE: type(`${PLATFORM} select zone`),
      SELECT_SURVEY: type(`${PLATFORM} select survey`),
      SELECT_TRANSECT: type(`${PLATFORM} select transect`),
      SELECT_ZONE_PREF: type(`${PLATFORM} select species preference zone`),
      SELECT_COUNT: type(`${PLATFORM} select count`),
      REMOVE_MSG: type(`${PLATFORM} remove message`)
    };

  /**
   * Add platform to Platform list Actions
   */
  export class AddPlatformAction implements Action {
    readonly type = ActionTypes.ADD_PLATFORM;

    constructor(public payload: Platform) {}
  }

  export class AddPlatformSuccessAction implements Action {
    readonly type = ActionTypes.ADD_PLATFORM_SUCCESS;

    constructor(public payload: Platform) {}
  }

  export class AddPlatformFailAction implements Action {
    readonly type = ActionTypes.ADD_PLATFORM_FAIL;

    constructor(public payload: any) {}
  }

  export class ImportPlatformAction implements Action {
    readonly type = ActionTypes.IMPORT_PLATFORM;

    constructor(public payload: any) {}
  }

  export class ImportPlatformSuccessAction implements Action {
    readonly type = ActionTypes.IMPORT_PLATFORM_SUCCESS;

    constructor(public payload: Platform) {}
  }

  /**
   * Remove platform from Platform list Actions
   */
  export class RemovePlatformAction implements Action {
    readonly type = ActionTypes.REMOVE_PLATFORM;

    constructor(public payload: Platform) {}
  }

  export class RemovePlatformSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_PLATFORM_SUCCESS;

    constructor(public payload: Platform) {}
  }

  export class RemovePlatformFailAction implements Action {
    readonly type = ActionTypes.REMOVE_PLATFORM_FAIL;

    constructor(public payload: Platform) {}
  }

  /**
   * Add zone to Platform  Actions
   */
  export class AddZoneAction implements Action {
    readonly type = ActionTypes.ADD_ZONE;

    constructor(public payload: Zone) {}
  }

  export class AddZoneSuccessAction implements Action {
    readonly type = ActionTypes.ADD_ZONE_SUCCESS;

    constructor(public payload: Zone) {}
  }

  export class AddZoneFailAction implements Action {
    readonly type = ActionTypes.ADD_ZONE_FAIL;

    constructor(public payload: Platform) {}
  }

  export class ImportZoneAction implements Action {
    readonly type = ActionTypes.IMPORT_ZONE;

    constructor(public payload: any) {}
  }

  export class ImportZoneSuccessAction implements Action {
    readonly type = ActionTypes.IMPORT_ZONE_SUCCESS;

    constructor(public payload: Zone) {}
  }

  /**
   * Remove zone from Platform  Actions
   */
  export class RemoveZoneAction implements Action {
    readonly type = ActionTypes.REMOVE_ZONE;

    constructor(public payload: Zone) {}
  }

  export class RemoveZoneSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_ZONE_SUCCESS;

    constructor(public payload: Zone) {}
  }

  export class RemoveZoneFailAction implements Action {
    readonly type = ActionTypes.REMOVE_ZONE_FAIL;

    constructor(public payload: Platform) {}
  }

  /**
   * Add zone pref to zone  Actions
   */
  export class AddZonePrefAction implements Action {
    readonly type = ActionTypes.ADD_ZONE_PREF;

    constructor(public payload: ZonePreference) {}
  }

  export class AddZonePrefSuccessAction implements Action {
    readonly type = ActionTypes.ADD_ZONE_PREF_SUCCESS;

    constructor(public payload: ZonePreference) {}
  }

  export class ImportZonePrefAction implements Action {
    readonly type = ActionTypes.IMPORT_ZONE_PREF;

    constructor(public payload: any) {}
  }

  export class ImportZonePrefSuccessAction implements Action {
    readonly type = ActionTypes.IMPORT_ZONE_PREF_SUCCESS;

    constructor(public payload: ZonePreference) {}
  }

  /**
   * Remove Zone Pref from Zone - Platform  Actions
   */
  export class RemoveZonePrefAction implements Action {
    readonly type = ActionTypes.REMOVE_ZONE_PREF;

    constructor(public payload: ZonePreference) {}
  }

  export class RemoveZonePrefSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_ZONE_PREF_SUCCESS;

    constructor(public payload: ZonePreference) {}
  }

  export class RemoveZonePrefFailAction implements Action {
    readonly type = ActionTypes.REMOVE_ZONE_PREF_FAIL;

    constructor(public payload: Platform) {}
  }

/**
   * Add survey to zone  Actions
   */
  export class AddSurveyAction implements Action {
    readonly type = ActionTypes.ADD_SURVEY;

    constructor(public payload: Survey) {}
  }

  export class AddSurveySuccessAction implements Action {
    readonly type = ActionTypes.ADD_SURVEY_SUCCESS;

    constructor(public payload: Survey) {}
  }

  export class ImportSurveyAction implements Action {
    readonly type = ActionTypes.IMPORT_SURVEY;

    constructor(public payload: any) {}
  }

  export class ImportSurveySuccessAction implements Action {
    readonly type = ActionTypes.IMPORT_SURVEY_SUCCESS;

    constructor(public payload: Survey) {}
  }

  /**
   * Remove Survey from Zone - Platform  Actions
   */
  export class RemoveSurveyAction implements Action {
    readonly type = ActionTypes.REMOVE_SURVEY;

    constructor(public payload: Survey) {}
  }

  export class RemoveSurveySuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_SURVEY_SUCCESS;

    constructor(public payload: Survey) {}
  }

  export class RemoveSurveyFailAction implements Action {
    readonly type = ActionTypes.REMOVE_SURVEY_FAIL;

    constructor(public payload: Platform) {}
  }

  /**
   * Add transect to zone  Actions
   */
  export class AddTransectAction implements Action {
    readonly type = ActionTypes.ADD_TRANSECT;

    constructor(public payload: Transect) {}
  }

  export class AddTransectSuccessAction implements Action {
    readonly type = ActionTypes.ADD_TRANSECT_SUCCESS;

    constructor(public payload: Transect) {}
  }

  export class ImportTransectAction implements Action {
    readonly type = ActionTypes.IMPORT_TRANSECT;

    constructor(public payload: any) {}
  }

  export class ImportTransectSuccessAction implements Action {
    readonly type = ActionTypes.IMPORT_TRANSECT_SUCCESS;

    constructor(public payload: Transect) {}
  }

  /**
   * Remove Transect from Zone - Platform  Actions
   */
  export class RemoveTransectAction implements Action {
    readonly type = ActionTypes.REMOVE_TRANSECT;

    constructor(public payload: Transect) {}
  }

  export class RemoveTransectSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_TRANSECT_SUCCESS;

    constructor(public payload: Transect) {}
  }

  export class RemoveTransectFailAction implements Action {
    readonly type = ActionTypes.REMOVE_TRANSECT_FAIL;

    constructor(public payload: Platform) {}
  }

  /**
   * Add count to transect  Actions
   */
  export class AddCountAction implements Action {
    readonly type = ActionTypes.ADD_COUNT;

    constructor(public payload: Count) {}
  }

  export class AddCountSuccessAction implements Action {
    readonly type = ActionTypes.ADD_COUNT_SUCCESS;

    constructor(public payload: Count) {}
  }

  export class ImportCountAction implements Action {
    readonly type = ActionTypes.IMPORT_COUNT;

    constructor(public payload: any) {}
  }

  export class ImportCountSuccessAction implements Action {
    readonly type = ActionTypes.IMPORT_COUNT_SUCCESS;

    constructor(public payload: Count) {}
  }

  /**
   * Remove Count from transect - Platform  Actions
   */
  export class RemoveCountAction implements Action {
    readonly type = ActionTypes.REMOVE_COUNT;

    constructor(public payload: Count) {}
  }

  export class RemoveCountSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_COUNT_SUCCESS;

    constructor(public payload: Count) {}
  }

  export class RemoveCountFailAction implements Action {
    readonly type = ActionTypes.REMOVE_COUNT_FAIL;

    constructor(public payload: Platform) {}
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
    constructor(public payload: Platform[]) {}
  }

  export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;
    constructor(public payload: any) {}
  }

  export class SelectPlatformAction implements Action {
    readonly type = ActionTypes.SELECT_PLATFORM;
    constructor(public payload: any) {}
  }

  export class SelectZoneAction implements Action {
    readonly type = ActionTypes.SELECT_ZONE;
    constructor(public payload: any) {}
  }

  export class SelectSurveyAction implements Action {
    readonly type = ActionTypes.SELECT_SURVEY;
    constructor(public payload: any) {}
  }

  export class SelectTransectAction implements Action {
    readonly type = ActionTypes.SELECT_TRANSECT;
    constructor(public payload: any) {}
  }

  export class SelectZonePrefAction implements Action {
    readonly type = ActionTypes.SELECT_ZONE_PREF;
    constructor(public payload: any) {}
  }

  export class SelectCountAction implements Action {
    readonly type = ActionTypes.SELECT_COUNT;
    constructor(public payload: any) {}
  }

  export class RemoveMsgAction implements Action {
    readonly type = ActionTypes.REMOVE_MSG;
    payload: string = null;
  }

  export type Actions =
    | AddPlatformAction
    | AddPlatformSuccessAction
    | AddPlatformFailAction
    | ImportPlatformAction
    | ImportPlatformSuccessAction
    | RemovePlatformAction
    | RemovePlatformSuccessAction
    | RemovePlatformFailAction
    | AddZoneAction
    | AddZoneSuccessAction
    | ImportZoneAction
    | ImportZoneSuccessAction
    | RemoveZoneAction
    | RemoveZoneSuccessAction
    | RemoveZoneFailAction
    | AddTransectAction
    | AddTransectSuccessAction
    | ImportTransectAction
    | ImportTransectSuccessAction
    | RemoveTransectAction
    | RemoveTransectSuccessAction
    | RemoveTransectFailAction
    | AddSurveyAction
    | AddSurveySuccessAction
    | ImportSurveyAction
    | ImportSurveySuccessAction
    | RemoveSurveyAction
    | RemoveSurveySuccessAction
    | RemoveSurveyFailAction
    | AddZonePrefAction
    | AddZonePrefSuccessAction
    | ImportZonePrefAction
    | ImportZonePrefSuccessAction
    | RemoveZonePrefAction
    | RemoveZonePrefSuccessAction
    | RemoveZonePrefFailAction
    | AddCountAction
    | AddCountSuccessAction
    | ImportCountAction
    | ImportCountSuccessAction
    | RemoveCountAction
    | RemoveCountSuccessAction
    | RemoveCountFailAction
    | LoadAction
    | LoadSuccessAction
    | LoadFailAction
    | SelectPlatformAction
    | SelectZoneAction
    | SelectSurveyAction
    | SelectTransectAction
    | SelectZonePrefAction
    | SelectCountAction
    | RemoveMsgAction;
 }
