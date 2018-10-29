import { IAnalyseState, analyseInitialState, getStationsAvailables } from "../states/index";
import { Platform, Zone, Station, Survey } from "../../datas/models/platform";
import { AnalyseAction } from "../actions/index";

export function analyseReducer(state: IAnalyseState = analyseInitialState, action: AnalyseAction.Actions): IAnalyseState {
  switch (action.type) {
    case AnalyseAction.ActionTypes.INIT: {
      //console.log(action.payload);
      return analyseInitialState;
    }

    case AnalyseAction.ActionTypes.SELECT_COUNTRY: {
      //console.log(action.payload);
      return {
        ...analyseInitialState,
        usedCountry: action.payload,
        
      };
    }

    case AnalyseAction.ActionTypes.SELECT_PLATFORMS: {
      let platforms = action.payload;

      return {
        ...state,
        usedPlatforms: platforms
      };
    }

    case AnalyseAction.ActionTypes.SELECT_YEARS: {
      let years = action.payload;

      return {
        ...state,
        usedYears: years
      };
    }

    case AnalyseAction.ActionTypes.SELECT_SURVEYS: {
      return {
        ...state,
        usedSurveys: action.payload
      };
    }

    case AnalyseAction.ActionTypes.SELECT_ZONES: {
      let newState = { ...state, usedZones: action.payload };
      let stations = getStationsAvailables(newState);
      return {
        ...newState,
        usedStations: stations
      };
    }

    case AnalyseAction.ActionTypes.SELECT_STATIONS: {
      return {
        ...state,
        usedStations: action.payload
      };
    }

    case AnalyseAction.ActionTypes.SELECT_SPECIES: {
      return {
        ...state,
        usedSpecies: action.payload
      };
    }

    case AnalyseAction.ActionTypes.SELECT_DIMS: {
      return {
        ...state,
        usedDims: action.payload
      };
    }

    case AnalyseAction.ActionTypes.SELECT_METHOD: {
      return {
        ...state,
        usedMethod: action.payload
      };
    }

    case AnalyseAction.ActionTypes.ANALYSE: {
      return {
        ...state,
        analysing: true,
        analysed: false
      };
    }

    case AnalyseAction.ActionTypes.ANALYSE_SUCCESS: {
      console.log(action.payload);
      return {
        ...state,
        result: action.payload,
        analysing: false,
        analysed: true,
        msg: "ANALYSE_SUCCESS"
      };
    }

    case AnalyseAction.ActionTypes.ANALYSE_FAILURE: {
      return {
        ...state,
        analysing: false,
        analysed: false,
        msg: "ANALYSE_FAILED"
      };
    }

    default: {
      return state;
    }
  }
}
