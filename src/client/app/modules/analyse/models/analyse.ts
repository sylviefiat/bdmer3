import { Platform, Zone, Transect, Survey, Species } from '../../datas/models/index';
import { Country } from '../../countries/models/country';

export interface Method {
    method: string;
}

export interface Data {
    usedCountry: Country;
    usedPlatforms: Platform[];
    usedYears: string[];
    usedSurveys: Survey[];
    usedZones: Zone[];
    usedTransects: Transect[];
    usedSpecies: Species[];
    usedMethod: Method;
}

export interface Results {
    name: string;
    resultPerSurvey:ResultSurvey[];
}

export interface ResultSurvey{
    name: string;
    resultPerSpecies:ResultSpecies[];
}

export interface ResultSpecies {
    name: string;
    resultPerTransect: ResultTransect[];
    indicators: Indicators[];
    interpretation: Interpretation[];
    stock: Stock[];
}

export interface ResultTransect {
    codeTransect: string;
    numberIndividual: number;        // nombre d'invidus
    biomasses: number[];             // biomasse par individu
    biomassTotal: number;            // somme des biomasses
    biomassPerSquareMeter: number;   // biomasse par m²
    density: number;                 // density = nb individus par m²
}

export interface Indicators {
    biomasses: number[];
    biomassTotal: number;
    biomassSalt: number;
    biomassDry: number;
    abundancyCalcul: number;
    densityTotalCalculIndividual: number;
    densityTotalCalculWeight: number;
}

export interface Interpretation {
    legalSizeIndividualPercentage: number;
}

export interface Stock {
    totalEstimation: number;
    quotaFresh: number;
    quotaSalt: number;
    quotaDry: number;
}
