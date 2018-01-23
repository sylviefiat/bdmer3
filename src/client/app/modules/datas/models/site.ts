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
    codeSite: string;
    surface: string;
    transects: Transect[];
    zonePreferences: ZonePreference[];
}

export interface Transect {
    code: string;
    codeSite: string;
    codeZone: string;
    longitude: string;
    latitude: string;
    counts: Count[];
}

export interface Count {
    code: string;
    codeCampagne: string;
    codeSite: string;
    codeZone: string;
    nomTransect: string;
    codeTransect: string;
    date: Date;
    codeSpecies: string;
    mesures: string;
}

export interface ZonePreference {
    code: string;
    codeSite: string;
    codeZone: string;
    codeSpecies: string;
    presence: string;
    infoSource: string;
}

export interface Campaign {
    code: string;
    codeSite: string;
    codeZone: string;
    dateStart: Date;
    dateEnd: Date;
    participants: string;
    surfaceTransect: number;
    description: string;
    codePays: string;
}
