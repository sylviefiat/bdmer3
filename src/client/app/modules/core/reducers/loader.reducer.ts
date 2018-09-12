import { ILoaderState, loaderInitialState } from '../states/index';

import { LoaderAction } from '../actions/index';

export function loaderReducer(
    state: ILoaderState = loaderInitialState,
    action: LoaderAction.Actions
): ILoaderState {
    console.log(action.type);
    switch (action.type) {

        case LoaderAction.ActionTypes.LOADING: {
            console.log("loading a false");
            return {
                loaded: false
            };
        }

        case LoaderAction.ActionTypes.LOADED: {
            console.log("loading a true");
            return {
                loaded: true
            };
        }

        default: {
            return state;
        }
    }
}