
import { User, Country } from '../../countries/models/country';
import { Platform, Zone, Station, Survey, Species } from '../../datas/models/index';
import { Method, Results, Data, DimensionsAnalyse, Year } from '../models/analyse';
import { MapService } from '../../core/services/index';
import { IAppState } from '../../ngrx/index';

export interface IAvailableValueState {
    years: Year[];
    surveys: Survey[];
    zones: Zone[];
    stations: Station[];
    species: Species[];
}

export const availableValueInitialState: IAvailableValueState = {
    years: null,
    surveys: null,
    zones: null,
    stations: null,
    species: null
};

export const getYearsAvailables = (state: IAvailableValueState) => state.years;

export const getSurveysAvailables = (state: IAvailableValueState) => state.surveys;

export const getZonesAvailables = (state: IAvailableValueState) => state.zones;

export const getStationsAvailables = (state: IAvailableValueState) => state.stations;

export const getSpeciesAvailables = (state: IAvailableValueState) => state.species;