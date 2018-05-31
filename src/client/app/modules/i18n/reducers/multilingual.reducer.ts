// module
import { IMultilingualState, initialState } from '../states/multilingual.state';
import { MultilingualAction } from '../actions/multilingual.action';

export function multilingualReducer(
    state: IMultilingualState = initialState,
    action: MultilingualAction.Actions
): IMultilingualState {
  switch (action.type) {
    case MultilingualAction.ActionTypes.LANG_CHANGED:
      if (state.lang !== action.payload)
        return (<any>Object).assign({}, state, {
            lang: action.payload
          });

      return state;
    default:
      return state;
  }
}
