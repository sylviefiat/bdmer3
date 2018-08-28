import { IAppInitState, appInitialState } from '../states/index';

import { AppInitAction } from '../actions/index';

export function appInitReducer(
    state: IAppInitState = appInitialState,
    action: AppInitAction.Actions
): IAppInitState {

    switch (action.type) {

        case AppInitAction.ActionTypes.LOAD_SERVICES_URL: {
            return state;
        }
        case AppInitAction.ActionTypes.SERVICES_URL_LOADED: {
            let url = action.payload ? action.payload.servicesBaseUrl : null;
            let prefix = action.payload ? action.payload.prefixDB : null;

            return {
                ...state,
                servicesBaseUrl: url,
                prefixDB: prefix
            };
        }
        default: {
            return state;
        }
    }
}