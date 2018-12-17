import { Platform, Zone, Station, Survey, Species, LegalDimensions } from '../../datas/models/index';
import { Country } from '../../countries/models/country';

export interface Method {
    method: string;
}

export interface Data {
    usedCountry: Country;
    usedPlatforms: Platform[];
    usedYears: any[];
    usedSurveys: Survey[];
    usedZones: Zone[];
    usedStations: Station[];
    usedSpecies: Species[];
    usedDims: DimensionsAnalyse[];
    usedMethod: Method;
}

export interface DimensionsAnalyse {
    codeSp: string;
    longMin: number;
    longMax: number;
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
    resultAll ?: ResultSpecies[];
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

export interface ResultStation {
    codeStation: string;
    latitude: number;
    longitude: number;
    surface: number;                       // surface de la station en m²
    nbCatches : number;                    // nombre total d'individus pêchés
    nbDivers ?: number;                    // nb plongées x nb plongeurs
    abundance: number;                     // abondance = nombre de mesures - mesures non considérées par l'analyse
    abundanceLegal ?: number;              // abondance de taille légale
    biomass ?: number;                     // somme des biomasses
    biomassLegal ?: number;                // somme des biommasses des individus de taille légale
    biomassPerHA ?: number;                // biomasse par hectare = somme biomasses * (10000 / surface station)
    densityPerHA: number;                  // densité par hectare = abondance * (10000 / surface station)
}

export interface ResultStationExport {
    codeStation: string;
    latitude: number;
    longitude: number;
    surface: number;                       // surface de la station en m²
    nbCatches: number;                     // nombre total d'individus pêchés
    nbDivers : number;                    // nb plongées x nb plongeurs
}

export interface ResultZone {
    codeZone: string;
    codePlatform: string;
    surface: number,                       // surface en m²
    nbStations: number;                    // nombre de stations considérées
    nbCatches : number;                    // nombre total d'individus pêchés
    fishingEffort ?: number;               // nb plongées x nb plongeurs
    ratioNstSurface: number;               // ratio nombre de station par rapport à la surface en km²
    averageAbundance: number;              // moyenne(abondance par station)
    abundance: number;                     // nbStrates x moyenne(abondance par station)
    averageAbundanceLegal ?: number;       // moyenne(abondance par station) des individus de taille légale
    averageBiomass ?: number;              // moyenne biomasse = moyenne(biomasses par station)
    biomass ?: number;                     // nbStrates x moyenne(biomasses par stations) * 1000
    averageBiomassLegal ?: number;         // // moyenne(biommasse par station) des individus de taille légale
    biomassPerHA ?: number;                // biomasse par hectare = biomass zone * (10000 / surface zone)
    abundancePerHA ?: number;              // abondance par hectare = abondance * (10000 / surface zone)
    SDBiomassPerHA ?: number;              // ecart type / standard deviation biomasse par hectare
    SDabundancePerHA: number;              // ecart type / standard deviation abondance par hectare
    nbStrates: number;                     // nombre de strates = surface zone / surface moyenne station
}

export interface ResultZoneExport {
    codeZone: string;
    codePlatform: string;
    surface: number,                       // surface en m²
    nbStations: number;                    // nombre de stations considérées
    nbCatches: number;                     // nombre total d'individus pêchés
    fishingEffort : number;                // nombre plongées x nb plongeurs
}


export interface ResultPlatform {
    codePlatform : string;
    surface: number;                       // surface en m²
    surfaceTotal: number;                  // surface en m²
    nbZones: number;                       // nombre de zones considérées
    nbZonesTotal: number;                  // nombre de zones total
    nbStations: number;                    // nombre de stations considérées
    nbStationsTotal: number;               // nombre de stations total
    nbCatches : number;                   // nombre total d'individus pêchés
    fishingEffort ?: number;               // nombre plongées x nb plongeurs
    //varianceAbundance: number;           // Variance abondance = somme[nb strates zone^2 x écart type abondance zone^2 * (1 - nb station zone / nb strates zone)] / nb strates total^2
    //varianceBiomass ?: number;           // Variance biomass = somme[nb strates zone^2 x écart type biomass zone^2 * (1 - nb station zone / nb strates zone)] / nb strates total^2
    confidenceIntervalAbundance?: number;  // racine de la variance abondance * T où T=2.05 (valeur approx. statistique de student pour plus de 30 stations)
    confidenceIntervalBiomass ?: number;   // racine de la variance biomasse * T où T=2.05 (valeur approx. statistique de student pour plus de 30 stations)    
    resultStock ?: ResultStock;
    averageAbundance?: number;             // moyenne abondance par station = somme(nb strates zone * moyenne abondance zone) / nb strates total
    averageAbundanceLegal ?:number;        // moyenne abondance par station individus de taille légale
    averageBiomass ?: number;              // moyenne biomasse par station = somme(nb strates zones x moyenne biomass stations zone) / nb strates total
    averageBiomassLegal ?:number;          // moyenne biomasse par station individus de taille légale
    nbStrates?: number;                    // nombre de strates = somme strates total zones
}

export interface ResultPlatformExport {
    codePlatform : string;
    surface: number;                       // surface en m²
    surfaceTotal: number;                  // surface en m²
    nbZones: number;                       // nombre de zones considérées
    nbZonesTotal: number;                  // nombre de zones total
    nbStations: number;                    // nombre de stations considérées
    nbStationsTotal: number;               // nombre de stations total
    nbCatches: number;                     // nombre total d'individus pêchés
    fishingEffort : number;                // nombre plongées x nb plongeurs
}

export interface ResultStock {
    stock ?: number;                       // stock
    stockCI ?: number;                     // intervalle de confiance stock
    stockCA ?: number;                     // hypothèse conservatrice stock
    stockLegal ?: number;                  // Stock (taille légale)
    abundance : number;                    // abondance / surface
    abundanceCI : number;                  // intervalle de confiance densité
    abundanceCA : number;                  // hypothèse conservatrice  densité
    abundanceLegal ?: number;              // densité de taille légale
    densityPerHA : number;                 // densité par hectare
    densityCAPerHA : number;               // hypothèse conservatrice de la densité par hectare
}