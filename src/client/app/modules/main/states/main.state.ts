
export interface IMainState {
  names: Array<string>;
}

export const mainInitialState: IMainState = {
  names: <Array<string>>[]
};

export const getNames = (state:IMainState) => state.names;

