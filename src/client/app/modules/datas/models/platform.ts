import { Species } from './species';

export interface Platform {
  _id: string;
  _rev: string;
  code: string;
  codeCountry: string;
  description: string;
  zones: Zone[];
  surveys: Survey[];
}

export interface Zone {
    code: string;
    codePlatform: string;
    surface: string;
    geojson: object;
    transects: Transect[];
    zonePreferences: ZonePreference[];
}

export interface Transect {
    code: string;
    codePlatform: string;
    codeZone: string;
    longitude: string;
    latitude: string;
}

export interface ZonePreference {
    code: string;
    codePlatform: string;
    codeZone: string;
    codeSpecies: string;
    presence: string;
    infoSource: string;
}

export interface Survey {
    code: string;
    codePlatform: string;
    dateStart: Date;
    dateEnd: Date;
    participants: string;
    surfaceTransect: number;
    description: string;
    codeCountry: string;
    counts: Count[];
}

export interface Count {
    code: string;
    codeSurvey: string;
    codePlatform: string;
    codeZone: string;
    codeTransect: string;
    date: Date;
    monospecies?: boolean;
    mesures: Mesure[];    
}

export interface Mesure {
  codeSpecies: string;
  long: string;
  larg: string;
}