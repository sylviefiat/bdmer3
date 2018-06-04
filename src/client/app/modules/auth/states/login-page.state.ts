import { Observable } from 'rxjs';

export interface ILoginPageState {
  error: string | null;
  pending: boolean;
}

export const loginPageInitialState: ILoginPageState = {
  error: null,
  pending: false,
};
export const getError = (state: ILoginPageState) => state.error;

export const getPending = (state: ILoginPageState) => state.pending;
