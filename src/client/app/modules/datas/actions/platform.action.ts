import { Action } from '@ngrx/store';
import { Platform,Zone, Station, ZonePreference,Count,Survey } from '../models/index';
import { type } from '../../core/utils/index';

export namespace PlatformAction {
  // Category to uniquely identify the actions
  export const PLATFORM: string = 'PlatformAction';


  export interface IPlatformActions {
      ADD_PLATFORM: string;
      ADD_PLATFORM_SUCCESS: string;
      ADD_PLATFORM_FAIL: string;
      IMPORT_PLATFORM: string;
      IMPORT_PLATFORM_SUCCESS: string;
      REMOVE_PLATFORM_COUNTRY: string;
      REMOVE_PLATFORM_COUNTRY_SUCCESS: string;
      REMOVE_PLATFORM_COUNTRY_FAIL: string;
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
      ADD_STATION: string;
      ADD_STATION_SUCCESS: string;
      IMPORT_STATION: string;
      IMPORT_STATION_SUCCESS: string;
      REMOVE_STATION: string;
      REMOVE_STATION_SUCCESS: string;
      REMOVE_STATION_FAIL: string;
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
      SELECT_STATION: string;
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
      REMOVE_PLATFORM_COUNTRY: type(`${PLATFORM} Remove Platform Country`),
      REMOVE_PLATFORM_COUNTRY_SUCCESS: type(`${PLATFORM} Remove Platform Country Success`),
      REMOVE_PLATFORM_COUNTRY_FAIL: type(`${PLATFORM} Remove Platform Country Fail`),
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
      ADD_STATION: type(`${PLATFORM} Add Station`),
      ADD_STATION_SUCCESS: type(`${PLATFORM} Add Station Success`),
      IMPORT_STATION: type(`${PLATFORM} Import Station`),
      IMPORT_STATION_SUCCESS:type(`${PLATFORM} Import Station Success`),
      REMOVE_STATION: type(`${PLATFORM} Remove Station`),
      REMOVE_STATION_SUCCESS: type(`${PLATFORM} Remove Station Success`),
      REMOVE_STATION_FAIL: type(`${PLATFORM} Remove Station Fail`), 
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
      SELECT_STATION: type(`${PLATFORM} select station`),
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

  export class RemovePlatformCountryAction implements Action {
    readonly type = ActionTypes.REMOVE_PLATFORM_COUNTRY;

    constructor(public payload: Platform) {}
  }

  export class RemovePlatformCountrySuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_PLATFORM_COUNTRY_SUCCESS;

    constructor(public payload: Platform) {}
  }

  export class RemovePlatformCountryFailAction implements Action {
    readonly type = ActionTypes.REMOVE_PLATFORM_COUNTRY_FAIL;

    constructor(public payload: Platform) {}
  }

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
   * Add station to zone  Actions
   */
  export class AddStationAction implements Action {
    readonly type = ActionTypes.ADD_STATION;

    constructor(public payload: Station) {}
  }

  export class AddStationSuccessAction implements Action {
    readonly type = ActionTypes.ADD_STATION_SUCCESS;

    constructor(public payload: Station) {}
  }

  export class ImportStationAction implements Action {
    readonly type = ActionTypes.IMPORT_STATION;

    constructor(public payload: any) {}
  }

  export class ImportStationSuccessAction implements Action {
    readonly type = ActionTypes.IMPORT_STATION_SUCCESS;

    constructor(public payload: Station) {}
  }

  /**
   * Remove Station from Zone - Platform  Actions
   */
  export class RemoveStationAction implements Action {
    readonly type = ActionTypes.REMOVE_STATION;

    constructor(public payload: Station) {}
  }

  export class RemoveStationSuccessAction implements Action {
    readonly type = ActionTypes.REMOVE_STATION_SUCCESS;

    constructor(public payload: Station) {}
  }

  export class RemoveStationFailAction implements Action {
    readonly type = ActionTypes.REMOVE_STATION_FAIL;

    constructor(public payload: Platform) {}
  }

  /**
   * Add count to station  Actions
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
   * Remove Count from station - Platform  Actions
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

  export class SelectStationAction implements Action {
    readonly type = ActionTypes.SELECT_STATION;
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
    | AddStationAction
    | AddStationSuccessAction
    | ImportStationAction
    | ImportStationSuccessAction
    | RemoveStationAction
    | RemoveStationSuccessAction
    | RemoveStationFailAction
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
    | SelectStationAction
    | SelectZonePrefAction
    | SelectCountAction
    | RemoveMsgAction;
 }
