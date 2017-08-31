import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';

export interface IAuthState {
  loggedIn: boolean;
  user: User | null;
}

export const authInitialState: IAuthState = {
  loggedIn: false,
  user: null,
};

export function getLoggedIn(state$: Observable<IAuthState>) {
  return state$.select(state => state.loggedIn);
}

export function getUser(state$: Observable<IAuthState>) {
  return state$.select(state => state.user);
}