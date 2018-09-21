import { ILoaderState, loaderInitialState } from '../states/index';

import { LoaderAction } from '../actions/index';

export function loaderReducer(
    state: ILoaderState = loaderInitialState,
    action: LoaderAction.Actions
): ILoaderState {
    switch (action.type) {

        case LoaderAction.ActionTypes.LOADING: {
            return {
                loaded: false
            };
        }

        case LoaderAction.ActionTypes.LOADED: {
            return {
                loaded: true
            };
        }

        default: {
            return state;
        }
    }
}