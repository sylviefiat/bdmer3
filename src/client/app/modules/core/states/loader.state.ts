
export interface ILoaderState {
    loaded: boolean;
}

export const loaderInitialState: ILoaderState = {
    loaded: true
};
export const getIsLoaderLoading = (state: ILoaderState) => state.loaded;
 