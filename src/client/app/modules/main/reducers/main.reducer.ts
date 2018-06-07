import { IMainState, mainInitialState } from '../states/index';

export function reducer(
  state: IMainState = mainInitialState,
  // could support multiple state actions via union type here
  // ie: NameList.Actions | Other.Actions
  // the seed's example just has one set of actions: NameList.Actions
): IMainState {

      return state;

}
