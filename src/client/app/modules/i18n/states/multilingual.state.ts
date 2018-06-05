
export interface IMultilingualState {
  lang: string;
}

export const multilingualInitialState: IMultilingualState = {
  lang: 'en'
};

export const getLang = (state:IMultilingualState) => state.lang;

