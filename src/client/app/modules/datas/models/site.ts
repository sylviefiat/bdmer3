import { Species } from './species';

export interface Site {
  _id: string;
  _rev: string;
  code: string;
  codeCountry: string;
  description: string;
  zones: Zone[];
  campaigns: Campaign[];
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
    codeCampaign: string;
    codeSite: string;
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