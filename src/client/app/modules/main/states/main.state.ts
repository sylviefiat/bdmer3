import { Observable } from 'rxjs/Observable';

export interface IMainState {
  names: Array<string>;
}

export const mainInitialState: IMainState = {
  names: <Array<string>>[]
};

export const getNames = (state:IMainState) => state.names;
// selects specific slice from sample state
/*export function getNames(state$: Observable<IMainState>) {
  return state$.select(state => state.names);
}*/
