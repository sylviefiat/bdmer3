export interface Species {
    _id: string;
    code: string;
    scientificName: string;
    names: NameI18N[];
    LLW: CoefsAB;
    LW: CoefsAB;
    conversions: Conversion;
    biologicDimensions: BiologicDimensions;
    distribution: string;
    habitatPreference: string;
    legalDimensions: LegalDimensions[];
}

export interface BiologicDimensions {   
    longMax: string;
    largMax: string;
}

export interface LegalDimensions {
    _id: string;
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