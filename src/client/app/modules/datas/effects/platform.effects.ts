import { Injectable } from "@angular/core";
import { defer, Observable, pipe, of } from "rxjs";
import { Action, Store } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, withLatestFrom, switchMap, tap, delay } from "rxjs/operators";
import { Router } from "@angular/router";

import {
  IAppState,
  getSelectedCountry,
  getSelectedPlatform,
  getSelectedZone,
  getAuthCountry,
  getAllCountriesInApp,
  getSpeciesInApp,
  getServiceUrl
} from "../../ngrx/index";
import { Csv2JsonService } from "../../core/services/csv2json.service";
import { PlatformService } from "../services/platform.service";
import { PlatformAction } from "../actions/index";
import { Platform, Zone, Station, Count, Survey, ZonePreference } from "../models/platform";
import { Country } from "../../countries/models/country";
import { Species } from "../../datas/models/species";
import { AppInitAction } from "../../core/actions/index";

//import { config } from '../../../config';

@Injectable()
export class PlatformEffects {
  @Effect({ dispatch: false })
  openDB$: Observable<any> = this.actions$.ofType<AppInitAction.FinishAppInitAction>(AppInitAction.ActionTypes.FINISH_APP_INIT).pipe(
    map((action: AppInitAction.FinishAppInitAction) => action.payload),
    withLatestFrom(this.store.select(getServiceUrl)),
    map(value => this.platformService.initDB("platforms", value[1]))
  );

  @Effect()
  loadPlatforms$: Observable<Action> = this.actions$.ofType<PlatformAction.LoadAction>(PlatformAction.ActionTypes.LOAD).pipe(
    switchMap(() => this.platformService.getAll()),
    map((platforms: Platform[]) => new PlatformAction.LoadSuccessAction(platforms)),
    catchError(error => of(new PlatformAction.LoadFailAction(error)))
  );

  @Effect()
  addPlatform$: Observable<Action> = this.actions$.ofType<PlatformAction.AddPlatformAction>(PlatformAction.ActionTypes.ADD_PLATFORM).pipe(
    map((action: PlatformAction.AddPlatformAction) => action.payload),
    withLatestFrom(this.store.select(getSelectedCountry)),
    mergeMap((value: [Platform, Country]) => this.platformService.editPlatform(value[0], value[1])),
    map((platform: Platform) => new PlatformAction.AddPlatformSuccessAction(platform)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  addZone$: Observable<Action> = this.actions$.ofType<PlatformAction.AddZoneAction>(PlatformAction.ActionTypes.ADD_ZONE).pipe(
    map((action: PlatformAction.AddZoneAction) => action.payload),
    withLatestFrom(this.store.select(getSelectedPlatform)),
    mergeMap((value: [Zone, Platform]) => this.platformService.editZone(value[0], value[1])),
    map((zone: Zone) => new PlatformAction.AddZoneSuccessAction(zone)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  addSurvey$: Observable<Action> = this.actions$.ofType<PlatformAction.AddSurveyAction>(PlatformAction.ActionTypes.ADD_SURVEY).pipe(
    map((action: PlatformAction.AddSurveyAction) => action.payload),
    withLatestFrom(this.store.select(getSelectedPlatform)),
    mergeMap((value: [Survey, Platform]) => this.platformService.editSurvey(value[1], value[0])),
    map((survey: Survey) => new PlatformAction.AddSurveySuccessAction(survey)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  addStation$: Observable<Action> = this.actions$.ofType<PlatformAction.AddStationAction>(PlatformAction.ActionTypes.ADD_STATION).pipe(
    map((action: PlatformAction.AddStationAction) => action.payload),
    withLatestFrom(this.store.select(getSelectedPlatform)),
    mergeMap((value: [Station, Platform]) => this.platformService.editStation(value[1], value[0])),
    map((station: Station) => new PlatformAction.AddStationSuccessAction(station)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  addZonePref$: Observable<Action> = this.actions$.ofType<PlatformAction.AddZonePrefAction>(PlatformAction.ActionTypes.ADD_ZONE_PREF).pipe(
    map((action: PlatformAction.AddZonePrefAction) => action.payload),
    withLatestFrom(this.store.select(getSelectedPlatform)),
    mergeMap((value: [ZonePreference, Platform]) => this.platformService.editZonePref(value[1], value[0])),
    map((zonePref: ZonePreference) => new PlatformAction.AddZonePrefSuccessAction(zonePref)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  checkZonePrefCsv$: Observable<Action> = this.actions$
    .ofType<PlatformAction.CheckZonePrefCsvFile>(PlatformAction.ActionTypes.CHECK_ZONE_PREF_CSV_FILE)
    .pipe(
      tap(() => this.store.dispatch(new PlatformAction.RemoveMsgAction())),
      map((action: PlatformAction.CheckZonePrefCsvFile) => action.payload),
      mergeMap((zonePref: any) => this.csv2jsonService.csv2("zonePref", zonePref)),
      withLatestFrom(this.store.select(getSelectedPlatform), this.store.select(getSpeciesInApp)),
      mergeMap((value: [any, any, any]) => this.platformService.importZonePrefVerification(value[0], value[1], value[2])),
      map((error: string) => new PlatformAction.CheckZonePrefAddErrorAction(error))
    );

  @Effect()
  addCount$: Observable<Action> = this.actions$.ofType<PlatformAction.AddCountAction>(PlatformAction.ActionTypes.ADD_COUNT).pipe(
    map((action: PlatformAction.AddCountAction) => action.payload),
    withLatestFrom(this.store.select(getSelectedPlatform)),
    mergeMap((value: [Count, Platform]) => this.platformService.editCount(value[1], value[0])),
    map((count: Count) => new PlatformAction.AddCountSuccessAction(count)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  importPlatform$: Observable<Action> = this.actions$.ofType<PlatformAction.ImportPlatformAction>(PlatformAction.ActionTypes.IMPORT_PLATFORM).pipe(
    map((action: PlatformAction.ImportPlatformAction) => action.payload),
    mergeMap((platform: Platform) => this.csv2jsonService.csv2("platform", platform)),
    withLatestFrom(this.store.select(getSelectedCountry)),
    // fait automatiquement une boucle sur les platforms retournés
    mergeMap((value: [any, Country]) => this.platformService.editPlatform(value[0], value[1])),
    map((platform: Platform) => new PlatformAction.ImportPlatformSuccessAction(platform)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  checkPlatformCsv$: Observable<Action> = this.actions$
    .ofType<PlatformAction.CheckPlatformCsvFile>(PlatformAction.ActionTypes.CHECK_PLATFORM_CSV_FILE)
    .pipe(
      tap(() => this.store.dispatch(new PlatformAction.RemoveMsgAction())),
      map((action: PlatformAction.CheckPlatformCsvFile) => action.payload),
      mergeMap((platform: Platform) => this.csv2jsonService.csv2("platform", platform)),
      // fait automatiquement une boucle sur les platforms retournées
      withLatestFrom(this.store.select(getAllCountriesInApp)),
      mergeMap((value: [any, Country[]]) => this.platformService.importPlatformVerification(value[0], value[1])),
      map((error: string) => new PlatformAction.CheckPlatformAddErrorAction(error))
    );

  @Effect()
  importZone$: Observable<Action> = this.actions$.ofType<PlatformAction.ImportZoneAction>(PlatformAction.ActionTypes.IMPORT_ZONE).pipe(
    map((action: PlatformAction.ImportZoneAction) => action.payload),
    withLatestFrom(this.store.select(getSelectedPlatform)),
    mergeMap((value: [Zone, Platform]) => this.platformService.editZone(value[0], value[1])),
    map((zone: Zone) => new PlatformAction.ImportZoneSuccessAction(zone)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  importSurvey$: Observable<Action> = this.actions$.ofType<PlatformAction.ImportSurveyAction>(PlatformAction.ActionTypes.IMPORT_SURVEY).pipe(
    map((action: PlatformAction.ImportSurveyAction) => action.payload),
    mergeMap((survey: Survey) => this.csv2jsonService.csv2("survey", survey)),
    withLatestFrom(this.store.select(getSelectedPlatform)),
    mergeMap((value: [Survey, Platform]) => this.platformService.editSurvey(value[1], value[0])),
    map((survey: Survey) => new PlatformAction.ImportSurveySuccessAction(survey)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  checkSurveyCsv$: Observable<Action> = this.actions$
    .ofType<PlatformAction.CheckSurveyCsvFile>(PlatformAction.ActionTypes.CHECK_SURVEY_CSV_FILE)
    .pipe(
      tap(() => this.store.dispatch(new PlatformAction.RemoveMsgAction())),
      map((action: PlatformAction.CheckSurveyCsvFile) => action.payload),
      mergeMap((survey: Survey) => this.csv2jsonService.csv2("survey", survey)),
      // fait automatiquement une boucle sur les platforms retournées
      withLatestFrom(this.store.select(getSelectedPlatform)),
      mergeMap((value: [Survey, Platform]) => this.platformService.importSurveyVerification(value[0], value[1])),
      map((error: string) => new PlatformAction.CheckPlatformAddErrorAction(error))
    );

  @Effect()
  addPendingSurvey$: Observable<Action> = this.actions$
    .ofType<PlatformAction.AddPendingSurveyAction>(PlatformAction.ActionTypes.ADD_PENDING_SURVEY)
    .pipe(
      tap(() => this.store.dispatch(new PlatformAction.RemoveMsgAction())),
      map((action: PlatformAction.AddPendingSurveyAction) => action.payload),
      mergeMap((survey: Survey) => this.csv2jsonService.csv2("survey", survey)),
      map(survey => new PlatformAction.AddPendingSurveySuccessAction(survey))
    );

  @Effect()
  removePendingSurvey$: Observable<Action> = this.actions$
    .ofType<PlatformAction.RemovePendingSurveyAction>(PlatformAction.ActionTypes.REMOVE_PENDING_SURVEY)
    .pipe(
      tap(() => this.store.dispatch(new PlatformAction.RemoveMsgAction())),
      map((action: PlatformAction.RemovePendingSurveyAction) => action.payload),
      mergeMap((survey: Survey) => this.csv2jsonService.csv2("survey", survey)),
      catchError((survey: Survey) => of(new PlatformAction.RemovePendingSurveySuccessAction(survey)))
    );

  @Effect()
  importStation$: Observable<Action> = this.actions$.ofType<PlatformAction.ImportStationAction>(PlatformAction.ActionTypes.IMPORT_STATION).pipe(
    map((action: PlatformAction.ImportStationAction) => action.payload),
    mergeMap((station: Station) => this.csv2jsonService.csv2("station", station)),
    withLatestFrom(this.store.select(getSelectedPlatform)),
    mergeMap((value: [Station, Platform]) => this.platformService.editStation(value[1], value[0])),
    map((station: Station) => new PlatformAction.ImportStationSuccessAction(station)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  checkStationCsv$: Observable<Action> = this.actions$
    .ofType<PlatformAction.CheckStationCsvFile>(PlatformAction.ActionTypes.CHECK_STATION_CSV_FILE)
    .pipe(
      tap(() => this.store.dispatch(new PlatformAction.RemoveMsgAction())),
      map((action: PlatformAction.CheckStationCsvFile) => action.payload),
      mergeMap((station: Station) => this.csv2jsonService.csv2("station", station)),
      // fait automatiquement une boucle sur les platforms retournées
      withLatestFrom(this.store.select(getSelectedPlatform)),
      mergeMap((value: [any, Platform]) => this.platformService.importStationVerification(value[0], value[1])),
      map((error: string) => new PlatformAction.CheckStationAddErrorAction(error))
    );

  @Effect()
  addPendingStation$: Observable<Action> = this.actions$
    .ofType<PlatformAction.AddPendingStationAction>(PlatformAction.ActionTypes.ADD_PENDING_STATION)
    .pipe(
      tap(() => this.store.dispatch(new PlatformAction.RemoveMsgAction())),
      map((action: PlatformAction.AddPendingStationAction) => action.payload),
      mergeMap((station: Station) => this.csv2jsonService.csv2("station", station)),
      map((station: Station) => new PlatformAction.AddPendingStationSuccessAction(station))
    );

  @Effect()
  removePendingStation$: Observable<Action> = this.actions$
    .ofType<PlatformAction.RemovePendingStationAction>(PlatformAction.ActionTypes.REMOVE_PENDING_STATION)
    .pipe(
      tap(() => this.store.dispatch(new PlatformAction.RemoveMsgAction())),
      map((action: PlatformAction.RemovePendingStationAction) => action.payload),
      mergeMap((station: Station) => this.csv2jsonService.csv2("station", station)),
      catchError((station: Station) => of(new PlatformAction.RemovePendingStationSuccessAction(station)))
    );

  @Effect()
  importZonePref$: Observable<Action> = this.actions$.ofType<PlatformAction.ImportZonePrefAction>(PlatformAction.ActionTypes.IMPORT_ZONE_PREF).pipe(
    map((action: PlatformAction.ImportZonePrefAction) => action.payload),
    withLatestFrom(this.store.select(getSpeciesInApp)),
    mergeMap((value, store) => this.csv2jsonService.csv2("zonePref", value, store[0])),
    withLatestFrom(this.store.select(getSelectedPlatform)),
    mergeMap((value: [any, Platform]) => this.platformService.editZonePref(value[1], value[0])),
    map((zonePref: ZonePreference) => new PlatformAction.ImportZonePrefSuccessAction(zonePref)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  importCount$: Observable<Action> = this.actions$.ofType<PlatformAction.ImportCountAction>(PlatformAction.ActionTypes.IMPORT_COUNT).pipe(
    map((action: PlatformAction.ImportCountAction) => action.payload),
    mergeMap((count: any) => this.csv2jsonService.csv2(count.type, count.csvFile)),
    withLatestFrom(this.store.select(getSelectedPlatform)),
    mergeMap((value: [Count, Platform]) => this.platformService.editCount(value[1], value[0])),
    map((count: Count) => new PlatformAction.ImportCountSuccessAction(count)),
    catchError(error => of(new PlatformAction.AddPlatformFailAction(error)))
  );

  @Effect()
  checkCountCsv$: Observable<Action> = this.actions$
    .ofType<PlatformAction.CheckCountCsvFile>(PlatformAction.ActionTypes.CHECK_COUNT_CSV_FILE)
    .pipe(
      tap(() => this.store.dispatch(new PlatformAction.RemoveMsgAction())),
      map((action: PlatformAction.CheckCountCsvFile) => action.payload),
      mergeMap((count: any) =>this.csv2jsonService.csv2(count.type, count.csvFile)),
      withLatestFrom(this.store.select(getSelectedPlatform), this.store.select(getSpeciesInApp)),
      mergeMap((value: any) => this.platformService.importCountVerification(value[0], value[1], value[2])),
      map((error:string) => new PlatformAction.CheckCountAddErrorAction(error))
    );

  @Effect()
  removePlatform$: Observable<Action> = this.actions$.ofType<PlatformAction.RemovePlatformAction>(PlatformAction.ActionTypes.REMOVE_PLATFORM).pipe(
    map((action: PlatformAction.RemovePlatformAction) => action.payload),
    mergeMap(platform => this.platformService.removePlatform(platform)),
    map((platform: Platform) => new PlatformAction.RemovePlatformSuccessAction(platform)),
    catchError(error => of(new PlatformAction.RemovePlatformFailAction(error)))
  );

  @Effect()
  removePlatformCountry$: Observable<Action> = this.actions$
    .ofType<PlatformAction.RemovePlatformCountryAction>(PlatformAction.ActionTypes.REMOVE_PLATFORM_COUNTRY)
    .pipe(
      map((action: PlatformAction.RemovePlatformCountryAction) => action.payload),
      mergeMap(platform => this.platformService.removePlatform(platform)),
      map((platform: Platform) => new PlatformAction.RemovePlatformCountrySuccessAction(platform)),
      catchError(error => of(new PlatformAction.RemovePlatformCountryFailAction(error)))
    );

  @Effect()
  removeZone$: Observable<Action> = this.actions$.ofType<PlatformAction.RemoveZoneAction>(PlatformAction.ActionTypes.REMOVE_ZONE).pipe(
    map((action: PlatformAction.RemoveZoneAction) => action.payload),
    mergeMap(zone => this.platformService.removeZone(zone)),
    map((zone: Zone) => new PlatformAction.RemoveZoneSuccessAction(zone)),
    catchError(error => of(new PlatformAction.RemovePlatformFailAction(error)))
  );

  @Effect()
  removeAllZone$: Observable<Action> = this.actions$.ofType<PlatformAction.RemoveAllZoneAction>(PlatformAction.ActionTypes.REMOVE_ALL_ZONE).pipe(
    map((action: PlatformAction.RemoveAllZoneAction) => action.payload),
    mergeMap(platform => this.platformService.removeAllZone(platform)),
    map((platform: Platform) => new PlatformAction.RemoveAllZoneSuccessAction(platform)),
    catchError(error => of(new PlatformAction.RemovePlatformFailAction(error)))
  );

  @Effect()
  removeSurvey$: Observable<Action> = this.actions$.ofType<PlatformAction.RemoveSurveyAction>(PlatformAction.ActionTypes.REMOVE_SURVEY).pipe(
    map((action: PlatformAction.RemoveSurveyAction) => action.payload),
    mergeMap(survey => this.platformService.removeSurvey(survey)),
    map((survey: Survey) => new PlatformAction.RemoveSurveySuccessAction(survey)),
    catchError(error => of(new PlatformAction.RemovePlatformFailAction(error)))
  );

  @Effect()
  removeStation$: Observable<Action> = this.actions$.ofType<PlatformAction.RemoveStationAction>(PlatformAction.ActionTypes.REMOVE_STATION).pipe(
    map((action: PlatformAction.RemoveStationAction) => action.payload),
    mergeMap(station => this.platformService.removeStation(station)),
    map((station: Station) => new PlatformAction.RemoveStationSuccessAction(station)),
    catchError(error => of(new PlatformAction.RemovePlatformFailAction(error)))
  );

  @Effect()
  removeZonePref$: Observable<Action> = this.actions$.ofType<PlatformAction.RemoveZonePrefAction>(PlatformAction.ActionTypes.REMOVE_ZONE_PREF).pipe(
    map((action: PlatformAction.RemoveZonePrefAction) => action.payload),
    mergeMap(zonePref => this.platformService.removeZonePref(zonePref)),
    map((zonePref: ZonePreference) => new PlatformAction.RemoveZonePrefSuccessAction(zonePref)),
    catchError(error => of(new PlatformAction.RemovePlatformFailAction(error)))
  );

  @Effect()
  removeCount$: Observable<Action> = this.actions$.ofType<PlatformAction.RemoveCountAction>(PlatformAction.ActionTypes.REMOVE_COUNT).pipe(
    map((action: PlatformAction.RemoveCountAction) => action.payload),
    mergeMap(count => this.platformService.removeCount(count)),
    map((count: Count) => new PlatformAction.RemoveCountSuccessAction(count)),
    catchError(error => of(new PlatformAction.RemovePlatformFailAction(error)))
  );

  @Effect()
  addPlatformSuccess$: Observable<Action> = this.actions$
    .ofType<PlatformAction.AddPlatformSuccessAction>(PlatformAction.ActionTypes.ADD_PLATFORM_SUCCESS)
    .pipe(
      map((action: PlatformAction.AddPlatformSuccessAction) => action.payload),
      mergeMap((platform: Platform) => this.router.navigate(["/platform/" + platform._id])),
      delay(3000),
      map(() => new PlatformAction.RemoveMsgAction())
    );

  @Effect()
  importOrRemovePlatformSuccess$: Observable<Action> = this.actions$
    .ofType<PlatformAction.ImportPlatformSuccessAction | PlatformAction.RemovePlatformSuccessAction>(
      PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS,
      PlatformAction.ActionTypes.REMOVE_PLATFORM_SUCCESS
    )
    .pipe(
      tap(() => this.router.navigate(["/platform"])),
      delay(3000),
      map(() => new PlatformAction.RemoveMsgAction())
    );

  @Effect()
  removePlatformCountrySuccess$: Observable<Action> = this.actions$
    .ofType<PlatformAction.RemovePlatformCountrySuccessAction>(PlatformAction.ActionTypes.REMOVE_PLATFORM_COUNTRY_SUCCESS)
    .pipe(map(() => new PlatformAction.RemoveMsgAction()));

  @Effect()
  addZoneSuccess$: Observable<Action> = this.actions$.ofType<PlatformAction.AddZoneSuccessAction>(PlatformAction.ActionTypes.ADD_ZONE_SUCCESS).pipe(
    map((action: PlatformAction.AddZoneSuccessAction) => action.payload),
    mergeMap((zone: Zone) => this.router.navigate(["/zone/" + zone.codePlatform + "/" + zone.properties.code])),
    delay(3000),
    map(() => new PlatformAction.RemoveMsgAction())
  );

  @Effect()
  importOrRemoveZoneSuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_ZONE_SUCCESS, PlatformAction.ActionTypes.REMOVE_ZONE_SUCCESS)
    .pipe(
      map((action: PlatformAction.ImportZoneSuccessAction | PlatformAction.RemoveZoneSuccessAction) => action.payload),
      mergeMap((zone: Zone) => this.router.navigate(["/platform/" + zone.codePlatform + "/zones"])),
      delay(3000),
      map(() => new PlatformAction.RemoveMsgAction())
    );

  @Effect()
  addSurveySuccess$: Observable<Action> = this.actions$
    .ofType<PlatformAction.AddSurveySuccessAction>(PlatformAction.ActionTypes.ADD_SURVEY_SUCCESS)
    .pipe(
      map((action: PlatformAction.AddSurveySuccessAction) => action.payload),
      mergeMap((survey: Survey) => this.router.navigate(["/survey/" + survey.codePlatform + "/" + survey.code])),
      delay(3000),
      map(() => new PlatformAction.RemoveMsgAction())
    );

  @Effect()
  importOrRemoveSurveySuccess$: Observable<Action> = this.actions$
    .ofType<PlatformAction.ImportSurveySuccessAction | PlatformAction.RemoveSurveySuccessAction>(
      PlatformAction.ActionTypes.IMPORT_SURVEY_SUCCESS,
      PlatformAction.ActionTypes.REMOVE_SURVEY_SUCCESS
    )
    .pipe(
      map((action: PlatformAction.ImportSurveySuccessAction | PlatformAction.RemoveSurveySuccessAction) => action.payload),
      mergeMap((survey: Survey) => this.router.navigate(["/platform/" + survey.codePlatform])),
      delay(3000),
      map(() => new PlatformAction.RemoveMsgAction())
    );

  @Effect()
  addZonePrefSuccess$: Observable<Action> = this.actions$
    .ofType<PlatformAction.AddZonePrefSuccessAction>(PlatformAction.ActionTypes.ADD_ZONE_PREF_SUCCESS)
    .pipe(
      map((action: PlatformAction.AddZonePrefSuccessAction) => action.payload),
      mergeMap((zonePref: ZonePreference) =>
        this.router.navigate(["/zonePref/" + zonePref.codePlatform + "/" + zonePref.codeZone + "/" + zonePref.code])
      ),
      delay(3000),
      map(() => new PlatformAction.RemoveMsgAction())
    );

  @Effect()
  importOrRemoveZonePrefSuccess$: Observable<Action> = this.actions$
    .ofType<PlatformAction.ImportZonePrefSuccessAction | PlatformAction.RemoveZonePrefSuccessAction>(
      PlatformAction.ActionTypes.IMPORT_ZONE_PREF_SUCCESS,
      PlatformAction.ActionTypes.REMOVE_ZONE_PREF_SUCCESS
    )
    .pipe(
      map((action: PlatformAction.ImportZonePrefSuccessAction | PlatformAction.RemoveZonePrefSuccessAction) => action.payload),
      mergeMap((zonePref: ZonePreference) => this.router.navigate(["/zone/" + zonePref.codePlatform + "/" + zonePref.codeZone + "/zonesPref"])),
      delay(3000),
      map(() => new PlatformAction.RemoveMsgAction())
    );

  @Effect()
  addStationSuccess$: Observable<Action> = this.actions$
    .ofType<PlatformAction.AddStationSuccessAction>(PlatformAction.ActionTypes.ADD_STATION_SUCCESS)
    .pipe(
      map((action: PlatformAction.AddStationSuccessAction) => action.payload),
      mergeMap((station: Station) => this.router.navigate(["/station/" + station.codePlatform + "/" + station.properties.code])),
      delay(3000),
      map(() => new PlatformAction.RemoveMsgAction())
    );

  @Effect()
  importOrRemoveStationSuccess$: Observable<Action> = this.actions$
    .ofType<PlatformAction.ImportStationSuccessAction | PlatformAction.RemoveStationSuccessAction>(
      PlatformAction.ActionTypes.IMPORT_STATION_SUCCESS,
      PlatformAction.ActionTypes.REMOVE_STATION_SUCCESS
    )
    .pipe(
      map((action: PlatformAction.ImportStationSuccessAction | PlatformAction.RemoveStationSuccessAction) => action.payload),
      mergeMap((station: Station) => this.router.navigate(["/platform/" + station.codePlatform])),
      delay(3000),
      map(() => new PlatformAction.RemoveMsgAction())
    );

  @Effect()
  addCountSuccess$: Observable<Action> = this.actions$
    .ofType<PlatformAction.AddCountSuccessAction>(PlatformAction.ActionTypes.ADD_COUNT_SUCCESS)
    .pipe(
      map((action: PlatformAction.AddCountSuccessAction) => action.payload),
      mergeMap((count: Count) => this.router.navigate(["/count/" + count.codePlatform + "/" + count.codeSurvey + "/" + count.code])),
      delay(3000),
      map(() => new PlatformAction.RemoveMsgAction())
    );

  @Effect()
  importOrRemoveCountSuccess$: Observable<Action> = this.actions$
    .ofType<PlatformAction.ImportCountSuccessAction | PlatformAction.RemoveCountSuccessAction>(
      PlatformAction.ActionTypes.IMPORT_COUNT_SUCCESS,
      PlatformAction.ActionTypes.REMOVE_COUNT_SUCCESS
    )
    .pipe(
      map((action: PlatformAction.ImportCountSuccessAction | PlatformAction.RemoveCountSuccessAction) => action.payload),
      mergeMap((count: Count) => this.router.navigate(["/survey/" + count.codePlatform + "/" + count.codeSurvey])),
      delay(3000),
      map(() => new PlatformAction.RemoveMsgAction())
    );

  constructor(
    private actions$: Actions,
    private store: Store<IAppState>,
    private router: Router,
    private platformService: PlatformService,
    private csv2jsonService: Csv2JsonService
  ) {}
}
