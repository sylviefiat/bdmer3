import { Observable } from 'rxjs/Observable';

export interface ILoginPageState {
  error: string | null;
  pending: boolean;
}

export const loginPageInitialState: ILoginPageState = {
  error: null,
  pending: false,
};

export function getError(state$: Observable<ILoginPageState>){
  return state$.select(state => state.error);
}

export function getPending(state$: Observable<ILoginPageState>){
  return state$.select(state => state.pending);
}