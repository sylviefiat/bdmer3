export interface Species {
    _id: string;
    code: string;
    scientificName: string;
    sp_nom: string;
    sp_name: string;
    LLW_coef_a: string;
    LLW_coef_b: string;
    LW_coef_a: string;
    LW_coef_b: string;
    conversion_salt: string;
    conversion_BDM: string;
    long_max: string;
    larg_max: string;
    distribution: string;
    habtitat_preference: string;
    dimensions: Dimensions[];
}

export interface Dimensions {
    _id: string;
    codeSpecies: string;
    codeCountry: string;
    L_min: string;
    L_max: string
}