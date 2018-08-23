import { Platform, Zone, Station, Survey, Species, LegalDimensions } from '../../datas/models/index';
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
    usedStations: Station[];
    usedSpecies: Species[];
    usedDims: DimensionsAnalyse[];
    usedMethod: Method;
}

export interface Results {
    name: string;
    resultPerSurvey:ResultSurvey[];
    chartsData: ChartsData;
}

export interface ResultSurvey{
    codeSurvey: string;
    yearSurvey: number;
    codePlatform: string;
    resultPerSpecies:ResultSpecies[];
}

export interface ResultSpecies {
    codeSpecies: string;
    numberIndividual: number;
    biomassTotal: number;
    biomassesPerStation: number[];
    individualsPerStation: number[];
    SDBiomassTotal: number;
    SDAbundancyTotal: number;
    resultPerStation: ResultStation[];
    resultPerZone: ResultZone[];
    legalDimensions: LegalDimensions;
}

export interface DimensionsAnalyse {
    codeSp: string;
    longMin: string;
    longMax: string;
}

export interface ResultStation {
    codeStation: string;
    numberIndividual: number;        // nombre d'invidus
    biomasses: number[];             // biomasse par individu
    biomassTotal: number;            // somme des biomasses
    biomassPerHA: number;            // biomasse par hectare
    densityPerHA: number;            // density = nb individus par hectare
    SDBiomassTotal: number;          // ecart type / standard deviation biomasse
    SDDensityTotal: number;          // ecart type / standard deviation densité
}

export interface ResultZone {
    codeZone: string;
    numberIndividual: number;        // nombre d'invidus
    biomasses: number[];             // biomasse par individu
    biomassesPerHA: number[];        // biomasse par hectare par station
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

export interface ChartsData {
    chartsZonesBiomass: ChartsZone[];
    chartsZonesAbundancy: ChartsZone[];
}

export interface ChartsZone {
    code: string;
    chartsStations: ChartsStation[];
}

export interface ChartsStation {
    code: string;
    species: Species[];
    dataSpline: number[][];
    dataError: number[][][];
    dataPie: number[];
}
