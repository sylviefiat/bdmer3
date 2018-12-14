import { Action } from '@ngrx/store';
import { Platform, Zone, Survey, Station } from '../../datas/models/platform';
import { Species } from '../../datas/models/species';
import { Year } from '../models/analyse';
import { type } from '../../core/utils/index';

export namespace SelectAction {

    export const AUTH: string = 'SelectAction';

    export interface IAnalyseActions {
        INIT: string;
        SET_YEARS: string;
        SET_SURVEYS: string;
        SET_ZONES: string;
        SET_STATIONS: string;
        SET_SPECIES: string;
    }

    export const ActionTypes: IAnalyseActions = {
        INIT: type('[Select] Init action'),
        SET_YEARS: type('[Select] Set years'),
        SET_SURVEYS: type('[Select] Set Surveys'),
        SET_ZONES: type('[Select] Set Zones'),
        SET_STATIONS: type('[Select] Set Stations'),
        SET_SPECIES: type('[Select] Set Species')
    }

    export class InitSelect implements Action {
        readonly type = ActionTypes.INIT;
        payload: any = null;
    }

    export class SetYears implements Action {
        readonly type = ActionTypes.SET_YEARS;

        constructor(public payload: Year[]) { }
    }

    export class SetSurveys implements Action {
        readonly type = ActionTypes.SET_SURVEYS;

        constructor(public payload: Survey[]) { }
    }

    export class SetZones implements Action {
        readonly type = ActionTypes.SET_ZONES;

        constructor(public payload: Zone[]) { }
    }

    export class SetStations implements Action {
        readonly type = ActionTypes.SET_STATIONS;
        constructor(public payload: Station[]) { }
    }

    export class SetSpecies implements Action {
        readonly type = ActionTypes.SET_SPECIES;

        constructor(public payload: Species[]) { }
    }

    export type Actions =
        | InitSelect
        | SetYears
        | SetSurveys
        | SetZones
        | SetStations
        | SetSpecies;
}
