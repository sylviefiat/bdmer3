import { Observable } from 'rxjs/Observable';

export interface IMultilingualState {
  lang: string;
}

export const initialState: IMultilingualState = {
  lang: 'en'
};

export const getLang = (state:IMultilingualState) => state.lang;
/*export function getLang(state$: Observable<IMultilingualState>) {
  return state$.select(state => state.lang);
}*/
