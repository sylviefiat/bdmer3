import { IAppInitState, appInitialState } from '../states/index';

import { AppInitAction } from '../actions/index';

export function appInitReducer(
    state: IAppInitState = appInitialState,
    action: AppInitAction.Actions
): IAppInitState {
    console.log(action);
    switch (action.type) {

        case AppInitAction.ActionTypes.LOAD_SERVICES_URL: {
            return state;
        }
        case AppInitAction.ActionTypes.SERVICES_URL_LOADED: {
            
            let url = action.payload ? action.payload.servicesBaseUrl : null;

            return {
                ...state,
                servicesBaseUrl: url
            };
        }
        default: {
            return state;
        }
    }
}