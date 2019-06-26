import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { defer, Observable, pipe, of, from } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, tap, filter, mergeMap, exhaustMap } from 'rxjs/operators';

import { IAppState, getAnalyseUsedPlatform, getAnalyseUsedSurvey, getSpeciesInApp } from '../../ngrx/index';
import { AnalyseAction, SelectAction } from '../actions/index';
import { Data, Results, Year } from '../models/index';
import { Platform, Survey, Zone, Station, Species } from '../../datas/models/index';
import { SelectService } from '../services/index';
import { CountryAction } from '../../countries/actions/index';
import { LoaderAction } from "../../core/actions/index";

@Injectable()
export class SelectEffects {



  @Effect() selectPlatforms$ = this.actions$
    .pipe(
      ofType<AnalyseAction.SelectPlatforms>(AnalyseAction.ActionTypes.SELECT_PLATFORMS),
      map((action: AnalyseAction.SelectPlatforms) => action.payload),
      mergeMap((platforms: Platform[]) => this.selectService.setYearsAvailables(platforms)),
      map((years: Year[]) => new SelectAction.SetYears(years))
    );

  @Effect() selectYears$ = this.actions$
    .pipe(
      ofType<AnalyseAction.SelectYears>(AnalyseAction.ActionTypes.SELECT_YEARS),
      map((action: AnalyseAction.SelectYears) => action.payload),
      withLatestFrom(this.store.select(getAnalyseUsedPlatform)),
      mergeMap((value:[Year[],Platform[]]) => this.selectService.setSurveysAvailables(value[1],value[0])),
      map((surveys: Survey[]) => new SelectAction.SetSurveys(surveys))
    );

  @Effect() selectSurveys$ = this.actions$
    .pipe(
      ofType<AnalyseAction.SelectSurveys>(AnalyseAction.ActionTypes.SELECT_SURVEYS),
      map((action: AnalyseAction.SelectSurveys) => action.payload),
      withLatestFrom(this.store.select(getAnalyseUsedPlatform)),
      mergeMap((value:[Survey[],Platform[]]) => this.selectService.setZonesAvailables(value[1],value[0])),
      map((zones: Zone[]) => new SelectAction.SetZones(zones))
    );

  @Effect() setStations$ = this.actions$
     .pipe(
      ofType<SelectAction.SetZones>(SelectAction.ActionTypes.SET_ZONES),
      map((action: SelectAction.SetZones) => action.payload),
      withLatestFrom(this.store.select(getAnalyseUsedPlatform),this.store.select(getAnalyseUsedSurvey)),
      mergeMap((value:[Zone[],Platform[],Survey[]]) => this.selectService.setStationsAvailables(value[1],value[0],value[2])),
      map((stations: Station[]) => new SelectAction.SetStations(stations))
    );

  @Effect() selectZones$ = this.actions$
    .pipe(
      ofType<AnalyseAction.SelectZones>(AnalyseAction.ActionTypes.SELECT_ZONES),
      map((action: AnalyseAction.SelectZones) => action.payload),
      withLatestFrom(this.store.select(getAnalyseUsedPlatform),this.store.select(getAnalyseUsedSurvey)),
      mergeMap((value:[Zone[],Platform[],Survey[]]) => this.selectService.setStationsAvailables(value[1],value[0],value[2])),
      map((stations: Station[]) => new SelectAction.SetStations(stations))
    );

  @Effect() setSpecies$ = this.actions$
    .pipe(
      ofType<SelectAction.SetStations>(SelectAction.ActionTypes.SET_STATIONS),
      map((action: SelectAction.SetStations) => action.payload),
      withLatestFrom(this.store.select(getSpeciesInApp),this.store.select(getAnalyseUsedSurvey)),
      mergeMap((value:[Station[],Species[],Survey[]]) => this.selectService.setSpeciesAvailables(value[1],value[2],value[0])),
      map((species: Species[]) => new SelectAction.SetSpecies(species))
    );

  @Effect() selectStations$ = this.actions$
    .pipe(
      ofType<AnalyseAction.SelectStations>(AnalyseAction.ActionTypes.SELECT_STATIONS),
      map((action: AnalyseAction.SelectStations) => action.payload),
      withLatestFrom(this.store.select(getSpeciesInApp),this.store.select(getAnalyseUsedSurvey)),
      mergeMap((value:[Station[],Species[],Survey[]]) => this.selectService.setSpeciesAvailables(value[1],value[2],value[0])),
      map((species: Species[]) => new SelectAction.SetSpecies(species))
    );


  constructor(
    private actions$: Actions,
    private selectService: SelectService,
    private router: Router,
    private store: Store<IAppState>
  ) { }
}