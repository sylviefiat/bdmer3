import { Species } from './species';

export interface Site {
  _id: string;
  code: string;
  codeCountry: string;
  description: string;
  zones: Zone[];

}

export interface Zone {
    _id: string;
    code: string;
    surface: string;
    transects: Transect[];
    zonePreference: ZonePreference[];
}

export interface Transect {
    _id: string;
    code: string;
    name: string;
    longitude: string;
    latitude: string;
    counts: Count[];
}

export interface Count {
    _id: string;
    date: string;
    codeSpecies: string;
    long_mm: string;
    larg_mm: string;
}

export interface ZonePreference {
    _id: string;
    code: string;
    codeSpecies: string;
    presence: string;
    info_source: string;
}
