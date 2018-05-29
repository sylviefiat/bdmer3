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

export interface Geometry {
  coordinates: number[];
}

export interface Zone {
    type: string;
    geometry: Geometry;
    staticmap: string;
    properties: Property;
    codePlatform: string;
    stations: Station[];
    zonePreferences: ZonePreference[];
}

export interface Property{
  name: string;
  code: string;
  surface: number;
}

export interface Station {
    type: string;
    geometry: Geometry;
    properties: StationProperties;
    staticMapStation: string;
    codeZone: string;
    codePlatform: string;
}

export interface StationProperties {
    name: string;
    code: string;
    description: string;
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
    surfaceStation: number;
    description: string;
    codeCountry: string;
    counts: Count[];
}

export interface Count {
    code: string;
    codeSurvey: string;
    codePlatform: string;
    codeZone: string;
    codeStation: string;
    date: Date;
    monospecies?: boolean;
    mesures: Mesure[];    
}

export interface Mesure {
  codeSpecies: string;
  long: string;
  larg: string;
}