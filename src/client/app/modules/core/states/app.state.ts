
export interface IAppInitState {
    servicesBaseUrl: string;
}

export const appInitialState: IAppInitState = {
    servicesBaseUrl: null
};
export const getServicesBaseUrl = (state: IAppInitState) => state.servicesBaseUrl;