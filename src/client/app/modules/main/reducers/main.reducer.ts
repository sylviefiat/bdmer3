import { IMainState, mainInitialState } from '../states/index';
import { NameList } from '../actions/index';

export function reducer(
  state: IMainState = mainInitialState,
  // could support multiple state actions via union type here
  // ie: NameList.Actions | Other.Actions
  // the seed's example just has one set of actions: NameList.Actions
  action: NameList.Actions
): IMainState {
  switch (action.type) {
    

    default:
      return state;
  }
}
