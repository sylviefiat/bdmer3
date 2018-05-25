import { Platform, Zone, Transect, Survey, Species, LegalDimensions } from '../../datas/models/index';
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
    usedDims: DimensionsAnalyse[];
    usedMethod: Method;
}

export interface Results {
    name: string;
    resultPerSurvey:ResultSurvey[];
}

export interface ResultSurvey{
    codeSurvey: string;
    resultPerSpecies:ResultSpecies[];
}

export interface ResultSpecies {
    codeSpecies: string;
    numberIndividual: number;
    biomassTotal: number;
    biomassesPerTransect: number[];
    individualsPerTransect: number[];
    SDBiomassTotal: number;
    SDAbundancyTotal: number;
    resultPerTransect: ResultTransect[];
    resultPerZone: ResultZone[];
    legalDimensions: LegalDimensions;
}

export interface DimensionsAnalyse {   
    codeSp: string;
    longMin: string;
    largMin: string;
}

export interface ResultTransect {
    codeTransect: string;
    numberIndividual: number;        // nombre d'invidus
    biomasses: number[];             // biomasse par individu
    biomassTotal: number;            // somme des biomasses
    biomassPerHA: number;            // biomasse par hectare
    densityPerHA: number;            // density = nb individus par hectare
}

export interface ResultZone {
    codeZone: string;
    numberIndividual: number;        // nombre d'invidus
    biomasses: number[];             // biomasse par individu
    biomassesPerHA: number[];        // biomasse par hectare par transect
    densitiesPerHA: number[];        // densités par hectare par tranect
    biomassTotal: number;            // somme des biomasses
    biomassPerHA: number;            // biomasse par hectare
    densityPerHA: number;            // density = nb individus par hectare
    SDBiomassTotal: number;          // ecart type / standard deviation biomasse
    SDBiomassPerHA: number;          // ecart type / standard deviation biomasse par hectare
    SDDensityPerHA: number;          // ecart type / standard deviation densité par hectare
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
