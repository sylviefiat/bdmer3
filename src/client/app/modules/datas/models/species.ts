export interface Species {
    _id: string;
    _rev: string;
    code: string;
    scientificName: string;
    names: NameI18N[];
    LLW: CoefsAB;
    LW: CoefsAB;
    conversions: Conversion;
    biologicDimensions: Dimensions;
    distribution: string;
    habitatPreference: string;
    legalDimensions: LegalDimensions[];
    picture: string;
}

export interface Dimensions {   
    longMax: number;
    largMax: number;
}

export interface LegalDimensions {
    codeCountry: string;
    longMin: number;
    longMax: number
}

export interface NameI18N {
    lang: string;
    name: string;
}

export interface CoefsAB {
    coefA: number;
    coefB: number;
}

export interface Conversion {
    salt: number;
    BDM: number;
}