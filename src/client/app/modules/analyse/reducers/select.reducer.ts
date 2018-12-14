import { IAvailableValueState, availableValueInitialState } from "../states/index";
import { Platform, Zone, Station, Survey } from "../../datas/models/index";
import { Year } from '../models/index';
import { SelectAction } from "../actions/index";

export function selectReducer(state: IAvailableValueState = availableValueInitialState, action: SelectAction.Actions): IAvailableValueState {
    switch (action.type) {
        case SelectAction.ActionTypes.SET_YEARS: {
            return {
                ...state,
                years: action.payload
            };
        }

        case SelectAction.ActionTypes.SET_SURVEYS: {
            return {
                ...state,
                surveys: action.payload
            };
        }

        case SelectAction.ActionTypes.SET_ZONES: {
            return {
                ...state,
                zones: action.payload
            };
        }

        case SelectAction.ActionTypes.SET_STATIONS: {
            return {
                ...state,
                stations: action.payload
            };
        }

        case SelectAction.ActionTypes.SET_SPECIES: {
            return {
                ...state,
                species: action.payload
            };
        }

        default: {
            return state;
        }
    }
}