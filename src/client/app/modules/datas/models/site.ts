import { Species } from './species';

export interface Site {
  _id: string;
  _rev: string;
  code: string;
  codeCountry: string;
  description: string;
  zones: Zone[];

}

export interface Zone {
    code: string;
    surface: string;
    transects: Transect[];
    zonePreferences: ZonePreference[];
}

export interface Transect {
    code: string;
    name: string;
    longitude: string;
    latitude: string;
    counts: Count[];
}

export interface Count {
    date: string;
    codeSpecies: string;
    longMm: string;
    largMm: string;
}

export interface ZonePreference {
    code: string;
    codeSpecies: string;
    presence: string;
    infoSource: string;
}
