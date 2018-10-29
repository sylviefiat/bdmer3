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

export interface Year {
    year: number;
    startDate: Date;
    endDate: Date;
    checked?:boolean;
}

export interface Results {
    name: string;    
    resultPerSurvey:ResultSurvey[];
}

export interface ResultSurvey{
    codeSurvey: string;
    yearSurvey: number;
    codePlatform: string;
    resultPerSpecies:ResultSpecies[];
}

export interface ResultSpecies {
    codeSpecies: string;
    nameSpecies: string;
    resultPerStation: ResultStation[];
    resultPerZone: ResultZone[];
    resultPerPlatform: ResultPlatform[];
}

export interface DimensionsAnalyse {
    codeSp: string;
    longMin: number;
    longMax: number;
}

export interface ResultStation {
    codeStation: string;
    surface: number;                 // surface de la station
    abundance: number;               // abondance = nombre de mesures - mesures non considérées par l'analyse
    biomasses: number[];             // biomasse par individu = cf calcul biomasse en fonction du type de calcul LW ou LLW
    biomass: number;                 // somme des biomasses
    biomassPerHA: number;            // biomasse par hectare = somme biomasses * (10000 / surface station)
    abundancePerHA: number;          // abondance par hectare = abondance * (10000 / surface station)
}

export interface ResultZone {
    codeZone: string;
    codePlatform: string;
    surface: number,
    nbStrates: number;                 // nombre de strates = surface zone / surface moyenne station
    nbStations: number;                // nombre de stations considérées
    averageAbundance: number;          // moyenne(abondance par station)
    abundance: number;                 // nbStrates x moyenne(abondance par station)
    averageBiomass: number;            // moyenne biomasse = moyenne(biomasses par station)
    biomass: number;                   // nbStrates x moyenne(biomasses par stations) * 1000
    biomassPerHA: number;              // biomasse par hectare = biomass zone * (10000 / surface zone)
    abundancePerHA: number;            // abondance par hectare = abondance * (10000 / surface zone)
    SDBiomassPerHA: number;            // ecart type / standard deviation biomasse par hectare
    SDabundancePerHA: number;          // ecart type / standard deviation abondance par hectare
}


export interface ResultPlatform {
    codePlatform: string;
    surface: number;
    nbStrates: number;                     // nombre de strates = somme strates total zones
    nbZones: number;                       // nombre de zones considérées
    nbStations: number;                    // nombre de stations considérées
    averageAbundance: number;              // moyenne abondance par station = somme(nb strates zone * moyenne abondance zone) / nb strates total
    averageBiomass: number;                // moyenne biomasse par station = somme(nb strates zones x moyenne biomass stations zone) / nb strates total
    varianceAbundance: number;             // Variance abondance = somme[nb strates zone^2 x écart type abondance zone^2 * (1 - nb station zone / nb strates zone)] / nb strates total^2
    varianceBiomass: number;               // Variance biomass = somme[nb strates zone^2 x écart type biomass zone^2 * (1 - nb station zone / nb strates zone)] / nb strates total^2
    confidenceIntervalAbundance: number;   // racine de la variance abondance * T où T=2.05 (valeur approx. statistique de student pour plus de 30 stations)
    confidenceIntervalBiomass: number;     // racine de la variance biomasse * T où T=2.05 (valeur approx. statistique de student pour plus de 30 stations)    
    stockAbundance: number;                // stock (ind.): moyenne du nombre d'individu par station * nbr strates total
    stockBiomass: number;                  // stock (kg): moyenne des biomasses par station * nbr strates total / 1000
    stockCIAbundance: number;              // Intervalle de confiance abondance stock: intervalle de confiance platforme * nbr strates total / 1000
    stockCIBiomass: number;                // Intervalle de confiance biommasse stock: intervalle de confiance platforme * nbr strates total / 1000
    stockCAAbundance: number;              // Hypothèse conservatrice - conservative assumption - en kg: stock (ind) - Intervalle de confiance abondance
    stockCABiomass: number;                // Hypothèse conservatrice - conservative assumption - en kg: stock (kg) - Intervalle de confiance abondance
    stockDensityPerHA: number;             // Densité par Hectare : stock (ind.) * 10000 / surface plateau
}

