import { Observable } from 'rxjs/Observable';

import { User, Country } from '../../countries/models/country';
import { Zone, Transect, Campaign } from '../../datas/models/site';
import { Method, Result, CampaignSpecies } from '../models/analyse';

export interface IAnalyseState {
    usedCountries: Country[];
    usedCampaigns: Campaign[];
    usedZones: Zone[];
    usedTransects: Transect[];
    usedSpecies: CampaignSpecies[];
    methods: Method[],
    usedMethod: Method;
    analysing: boolean;
    analysed: boolean;
    result: Result;
    msg: string;
}

export const analyseInitialState: IAnalyseState = {
    usedCountries: null,
    usedCampaigns: null,
    usedZones: null,
    usedTransects: null,
    usedSpecies: null,
    methods: this.initMethods,
    usedMethod: null,
    analysing: false,
    analysed: false,
    result: null,
    msg: null
};

export const initMethods: Method[] = [
    {method: 'LONGLARG'},
    {method: 'LONGUEUR'}
]

export function getUsedCountries(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedCountries);
}

export function getUsedCampaigns(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedCampaigns);
}

export function getUsedZones(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedZones);
}

export function getUsedTransects(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedTransects);
}

export function getUsedSpecies(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedSpecies);
}

export function getMethods(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.methods);
}

export function getUsedMethod(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedMethod);
}

export function getAnalysing(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.analysing);
}

export function getAnalysed(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.analysed);
}

export function getResult(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.result);
}

export function getMsg(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.msg);
}