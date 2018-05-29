import { Action } from '@ngrx/store';
import { User, Country } from '../../countries/models/country';
import { Platform, Zone, Survey, Station } from '../../datas/models/platform';
import { Species } from '../../datas/models/species';
import { Method, DimensionsAnalyse } from '../models/analyse';
import { type } from '../../core/utils/index';
  
export namespace AnalyseAction {

  export const AUTH: string = 'AnalyseAction';

  export interface IAnalyseActions {
    SELECT_COUNTRY: string;
    SELECT_PLATFORMS: string;
    SELECT_YEARS: string;
    SELECT_SURVEYS: string;
    SELECT_ZONES: string;
    SELECT_STATIONS: string;
    SELECT_SPECIES: string;
    SELECT_DIMS: string;
    SELECT_METHOD: string;
    ANALYSE: string;
    ANALYSE_SUCCESS: string;
    ANALYSE_FAILURE: string;
  }

  export const ActionTypes: IAnalyseActions = {
    SELECT_COUNTRY : type('[Analyse] Select country'),
    SELECT_PLATFORMS : type('[Analyse] Select Platforms'),
    SELECT_YEARS : type('[Analyse] Select years'),
    SELECT_SURVEYS : type('[Analyse] Select Surveys'),
    SELECT_ZONES : type('[Analyse] Select Zones'),
    SELECT_STATIONS : type('[Analyse] Select Stations'),
    SELECT_SPECIES : type('[Analyse] Select Species'),
    SELECT_DIMS : type('[Analyse] Select Species dimensions'),
    SELECT_METHOD : type('[Analyse] Select method'),
    ANALYSE: type('[Analyse] Start analyse'),
    ANALYSE_SUCCESS : type('[Analyse] Analyse Success'),
    ANALYSE_FAILURE : type('[Analyse] Analyse Failure')
  }
export class SelectCountry implements Action {
  readonly type = ActionTypes.SELECT_COUNTRY;

  constructor(public payload: Country) {}
}

export class SelectPlatforms implements Action {
  readonly type = ActionTypes.SELECT_PLATFORMS;

  constructor(public payload: Platform[] ) {}
}

export class SelectYears implements Action {
  readonly type = ActionTypes.SELECT_YEARS;

  constructor(public payload: string[]) {}
}

export class SelectSurveys implements Action {
  readonly type = ActionTypes.SELECT_SURVEYS;

  constructor(public payload: Survey[] ) {}
}

export class SelectZones implements Action {
  readonly type = ActionTypes.SELECT_ZONES;

  constructor(public payload: Zone[]) {}
}

export class SelectStations implements Action {
  readonly type = ActionTypes.SELECT_STATIONS;
  constructor(public payload: Station[]) {}
}

export class SelectSpecies implements Action {
  readonly type = ActionTypes.SELECT_SPECIES;
  
  constructor(public payload: Species[]) {}
}

export class SelectDims implements Action {
  readonly type = ActionTypes.SELECT_DIMS;
  
  constructor(public payload: DimensionsAnalyse[]) {}
}

export class SelectMethod implements Action {
  readonly type = ActionTypes.SELECT_METHOD;

  constructor(public payload: Method) {}
}

export class Analyse implements Action {
  readonly type = ActionTypes.ANALYSE;

  constructor(public payload: any) {}
}

export class AnalyseSuccess implements Action {
  readonly type = ActionTypes.ANALYSE_SUCCESS;

  constructor(public payload: any) {}
}

export class AnalyseFailure implements Action {
  readonly type = ActionTypes.ANALYSE_FAILURE;

  constructor(public payload: any) {}
}

export type Actions =
  | SelectCountry
  | SelectPlatforms
  | SelectYears
  | SelectSurveys
  | SelectZones
  | SelectStations
  | SelectSpecies
  | SelectDims
  | SelectMethod
  | Analyse
  | AnalyseSuccess
  | AnalyseFailure;
}