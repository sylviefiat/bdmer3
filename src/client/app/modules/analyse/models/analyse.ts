
export interface Method {
    method: string;
}

export interface SurveySpecies {
    codeSurvey: string;
    speciesCodes: string[];
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
