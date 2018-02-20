import { IAnalyseState, analyseInitialState } from '../states/index';

import { AnalyseAction } from '../actions/index';

export function analyseReducer(
  state : IAnalyseState = analyseInitialState,
  action: AnalyseAction.Actions
): IAnalyseState {
  switch (action.type) {
    case AnalyseAction.ActionTypes.SELECT_COUNTRIES: {  
      return {
        ...state,
        usedCountries: action.payload
      };
    }

    case AnalyseAction.ActionTypes.SELECT_CAMPAIGNS: {  
      return {
        ...state,
        usedCampaigns: action.payload
      };
    }

    case AnalyseAction.ActionTypes.SELECT_ZONES: {  
      return {
        ...state,
        usedZones: action.payload
      };
    }

    case AnalyseAction.ActionTypes.SELECT_TRANSECTS: {  
      return {
        ...state,
        usedTransects: action.payload
      };
    }

    case AnalyseAction.ActionTypes.SELECT_SPECIES: {  
      return {
        ...state,
        usedSpecies: action.payload
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
      return {
        ...state,
        analysing: false,
        analysed: true,
        msg: "Analyse succeded"
      };
    }

    case AnalyseAction.ActionTypes.ANALYSE_FAILURE: {  
      return {
        ...state,
        analysing: false,
        analysed: false,
        msg: "Analyse failed"
      };
    }

    default: {
      return state;
    }
  }
}

