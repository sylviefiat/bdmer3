import { Species } from './species';

export interface Platform {
  _id: string;
  _rev: string;
  code: string;
  codeCountry: string;
  description: string;
  zones: Zone[];
  stations: Station[];
  surveys: Survey[];
  error?: string;
}

export interface Point {
  type: string;
  coordinates: number[];
}

export interface Polygon {
  type: string;
  coordinates: number[][][];
}

export interface Zone {
    type: string;
    geometry: Polygon;
    staticmap: string;
    properties: Property;
    codePlatform: string;
    zonePreferences: ZonePreference[];
}

export interface Property {
  id?: string;
  name: string;
  code: string;
  surface: number;
}

export interface Station {
    type: string;
    geometry: Point;
    properties: StationProperties;
    codePlatform: string;
    error?:string;
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
    picture: string;
    error?: string;
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
    error?:string;
}

export interface Count {
    code: string;
    codeSurvey: string;
    codePlatform: string;
    codeStation: string;
    date: Date;
    numberDivers?: number;
    monospecies?: boolean;
    quantities?: Quantity[];
    mesures?: Mesure[];
    error?:string;
}

export interface Quantity {
  codeSpecies: string;
  catches: number;
  density: number;
}

export interface Mesure {
  codeSpecies: string;
  long: number;
  larg: number;
}
