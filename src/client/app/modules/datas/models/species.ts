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
    longMax: string;
    largMax: string;
}

export interface LegalDimensions {
    codeCountry: string;
    longMin: string;
    longMax: string
}

export interface NameI18N {
    lang: string;
    name: string;
}

export interface CoefsAB {
    coefA: string;
    coefB: string;
}

export interface Conversion {
    salt: string;
    BDM: string;
}