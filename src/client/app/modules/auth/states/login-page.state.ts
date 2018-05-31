import { Observable } from 'rxjs/Observable';

export interface ILoginPageState {
  error: string | null;
  pending: boolean;
}

export const loginPageInitialState: ILoginPageState = {
  error: null,
  pending: false,
};
export const getError = (state: ILoginPageState) => state.error;
/*export function getError(state$: Observable<ILoginPageState>){
  return state$.select(state => state.error);
}*/
export const getPending = (state: ILoginPageState) => state.pending;
/*export function getPending(state$: Observable<ILoginPageState>){
  return state$.select(state => state.pending);
}*/