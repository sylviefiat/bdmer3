import { Observable } from 'rxjs/Observable';

import { User, Country } from '../../countries/models/country';
import { Zone, Transect, Campaign } from '../../datas/models/site';
import { Method, Result, CampaignSpecies } from '../models/analyse';
import { IAppState } from '../../ngrx/index';

export interface IAnalyseState {
    usedCountry: Country;
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
    usedCountry: null,
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

export function getUsedCountry(state$: Observable<IAnalyseState>) {
    return state$.select(state => state.usedCountry);
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

export function getZonesAvailables(state$: Observable<IAppState>) {
    //console.log(state$);
    return state$.select(state => {
        let zones=[];
        for(let i in state.analyse.usedCampaigns){
            zones[i] = state.site.entities.filter(site => site.code === state.analyse.usedCampaigns[i].codeSite)[0].zones;
        }
        return zones;
    })
}

export function getTransectsAvailables(state$: Observable<IAppState>) {
    //console.log(state$);
    return state$.select(state => {
        let transects=[];
        for(let i in state.analyse.usedCampaigns){
            transects[i]=[];
            for(let zone of state.site.entities.filter(site => site.code === state.analyse.usedCampaigns[i].codeSite)[0].zones){
                transects[i] = [...transects[i],...zone.transects];
            }
        }
        return transects;
    })
}