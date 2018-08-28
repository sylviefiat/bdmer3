
export interface IAppInitState {
    servicesBaseUrl: string;
    prefixDB: string;
}

export const appInitialState: IAppInitState = {
    servicesBaseUrl: null,
    prefixDB: null
};
export const getServicesBaseUrl = (state: IAppInitState) => state.servicesBaseUrl;

export const getPrefixDB = (state: IAppInitState) => state.prefixDB;