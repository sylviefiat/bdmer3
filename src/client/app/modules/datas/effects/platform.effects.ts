import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/delay';
import { _throw } from 'rxjs/observable/throw';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';

import { IAppState, getSelectedCountry, getSelectedPlatform, getSelectedZone } from '../../ngrx/index';
import { Csv2JsonService } from "../../core/services/csv2json.service";
import { PlatformService } from "../services/platform.service";
import { PlatformAction } from '../actions/index';
import { Platform, Zone, Transect, Count, Survey, ZonePreference } from '../models/platform';
import { Country } from '../../countries/models/country';

import { config } from '../../../config';

@Injectable()
export class PlatformEffects {


  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => {
    return this.platformService.initDB('platforms', config.urldb);
  });

  @Effect()
  loadPlatforms$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.LOAD)
    .switchMap(() =>
      this.platformService
        .getAll()
        .map((platforms: Platform[]) => new PlatformAction.LoadSuccessAction(platforms))
        .catch(error => of(new PlatformAction.LoadFailAction(error)))
    );

  @Effect()
  addPlatform$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_PLATFORM)
    .map((action: PlatformAction.AddPlatformAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedCountry))    
    .mergeMap((value: [Platform, Country]) => this.platformService.editPlatform(value[0], value[1]))
    .map((platform: Platform) => new PlatformAction.AddPlatformSuccessAction(platform))
    .catch((error) => of(new PlatformAction.AddPlatformFailAction(error)))
  ;

  @Effect()
  addZone$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_ZONE)
    .map((action: PlatformAction.AddZoneAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedPlatform))
    .mergeMap((value: [Zone, Platform]) => this.platformService.editZone(value[0], value[1]))
    .map((zone: Zone) => new PlatformAction.AddZoneSuccessAction(zone))
    .catch((error) => of(new PlatformAction.AddPlatformFailAction(error)))
  ;

  @Effect() 
  addSurvey$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_SURVEY)
    .map((action: PlatformAction.AddSurveyAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedPlatform))
    .mergeMap((value: [Survey, Platform]) => this.platformService.editSurvey(value[1], value[0]))
    .map((survey: Survey) => new PlatformAction.AddSurveySuccessAction(survey))
    .catch((error) => of(new PlatformAction.AddPlatformFailAction(error)))
  ;

  @Effect() 
  addTransect$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_TRANSECT)
    .map((action: PlatformAction.AddTransectAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedPlatform))
    .mergeMap((value: [Transect, Platform]) => this.platformService.editTransect(value[1], value[0]))
    .map((transect: Transect) => new PlatformAction.AddTransectSuccessAction(transect))
    .catch((error) => of(new PlatformAction.AddPlatformFailAction(error)))
  ;

  @Effect() 
  addZonePref$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_ZONE_PREF)
    .map((action: PlatformAction.AddZonePrefAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedPlatform))
    .mergeMap((value: [ZonePreference, Platform]) => this.platformService.editZonePref(value[1], value[0]))
    .map((zonePref: ZonePreference) => new PlatformAction.AddZonePrefSuccessAction(zonePref))
    .catch((error) => of(new PlatformAction.AddPlatformFailAction(error)))
  ;

  @Effect() 
  addCount$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_COUNT)
    .map((action: PlatformAction.AddCountAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedPlatform))
    .mergeMap((value: [Count, Platform]) => this.platformService.editCount(value[1], value[0]))
    .map((count: Count) => new PlatformAction.AddCountSuccessAction(count))
    .catch((error) => of(new PlatformAction.AddPlatformFailAction(error)))
  ;

  @Effect()
  importPlatform$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_PLATFORM)    
    .map((action: PlatformAction.ImportPlatformAction) => action.payload)
    .mergeMap((platform: Platform) => this.csv2jsonService.csv2('platform', platform))
    .withLatestFrom(this.store.let(getSelectedCountry))
    // fait automatiquement une boucle sur les platforms retournés
    .mergeMap((value: [Platform, Country]) => this.platformService.editPlatform(value[0], value[1]))
    .map((platform: Platform) => new PlatformAction.ImportPlatformSuccessAction(platform))
    .catch(error => of(new PlatformAction.AddPlatformFailAction(error)))
  ;

  @Effect()
  importZone$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_ZONE)    
    .map((action: PlatformAction.ImportZoneAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedPlatform))
    .mergeMap((value: [Zone, Platform]) => this.platformService.editZone(value[0], value[1]))    
    .map((zone: Zone) => new PlatformAction.ImportZoneSuccessAction(zone))
    .catch((error) => of(new PlatformAction.AddPlatformFailAction(error)));

  @Effect()
  importSurvey$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_SURVEY)
    .map((action: PlatformAction.ImportSurveyAction) => action.payload)
    .mergeMap((survey: Survey) => this.csv2jsonService.csv2('survey', survey))
    .withLatestFrom(this.store.let(getSelectedPlatform))
    .mergeMap((value: [Survey, Platform]) => this.platformService.editSurvey(value[1], value[0]))
    .map((survey: Survey) => new PlatformAction.ImportSurveySuccessAction(survey))
    .catch((error) => of(new PlatformAction.AddPlatformFailAction(error)));

  @Effect()
  importTransect$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_TRANSECT)
    .map((action: PlatformAction.ImportTransectAction) => action.payload)
    .mergeMap((transect: Transect) => this.csv2jsonService.csv2('transect', transect))
    .withLatestFrom(this.store.let(getSelectedPlatform))
    .mergeMap((value: [Transect, Platform]) => this.platformService.editTransect(value[1], value[0]))
    .map((transect: Transect) => new PlatformAction.ImportTransectSuccessAction(transect))
    .catch((error) => of(new PlatformAction.AddPlatformFailAction(error)));

  @Effect()
  importZonePref$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_ZONE_PREF)
    .map((action: PlatformAction.ImportZonePrefAction) => action.payload)
    .mergeMap((zonePref: ZonePreference) => this.csv2jsonService.csv2('zonePref', zonePref))
    .withLatestFrom(this.store.let(getSelectedPlatform))
    .mergeMap((value: [ZonePreference, Platform]) => this.platformService.editZonePref(value[1], value[0]))
    .map((zonePref: ZonePreference) => new PlatformAction.ImportZonePrefSuccessAction(zonePref))
    .catch((error) => of(new PlatformAction.AddPlatformFailAction(error)));

  @Effect()
  importCount$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_COUNT)
    .map((action: PlatformAction.ImportCountAction) => action.payload)
    .mergeMap((count: Count) => this.csv2jsonService.csv2('count', count))
    .withLatestFrom(this.store.let(getSelectedPlatform))
    .mergeMap((value: [Count, Platform]) => this.platformService.editCount(value[1], value[0]))
    .map((count: Count) => new PlatformAction.ImportCountSuccessAction(count))
    .catch((error) => of(new PlatformAction.AddPlatformFailAction(error)));

  @Effect()
  removePlatform$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.REMOVE_PLATFORM)
    .map((action: PlatformAction.RemovePlatformAction) => action.payload)
    .mergeMap(platform => this.platformService.removePlatform(platform))
    .map((platform:Platform) => new PlatformAction.RemovePlatformSuccessAction(platform))
    .catch((error) => of(new PlatformAction.RemovePlatformFailAction(error)))
  ;

  @Effect()
  removePlatformCountry$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.REMOVE_PLATFORM_COUNTRY)
    .map((action: PlatformAction.RemovePlatformCountryAction) => action.payload)
    .mergeMap(platform => this.platformService.removePlatform(platform))
    .map((platform:Platform) => new PlatformAction.RemovePlatformCountrySuccessAction(platform))
    .catch((error) => of(new PlatformAction.RemovePlatformCountryFailAction(error)))
  ;
  
  @Effect()
  removeZone$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.REMOVE_ZONE)
    .map((action: PlatformAction.RemoveZoneAction) => action.payload)
    .mergeMap(zone => this.platformService.removeZone(zone))
    .map((zone:Zone) => new PlatformAction.RemoveZoneSuccessAction(zone))
    .catch((error) => of(new PlatformAction.RemovePlatformFailAction(error)))
  ;
  
  @Effect()
  removeSurvey$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.REMOVE_SURVEY)
    .map((action: PlatformAction.RemoveSurveyAction) => action.payload)
    .mergeMap(survey => this.platformService.removeSurvey(survey))
    .map((survey:Survey) => new PlatformAction.RemoveSurveySuccessAction(survey))
    .catch((error) => of(new PlatformAction.RemovePlatformFailAction(error)))
  ;
  
  @Effect()
  removeTransect$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.REMOVE_TRANSECT)
    .map((action: PlatformAction.RemoveTransectAction) => action.payload)
    .mergeMap(transect => this.platformService.removeTransect(transect))
    .map((transect:Transect) => new PlatformAction.RemoveTransectSuccessAction(transect))
    .catch((error) => of(new PlatformAction.RemovePlatformFailAction(error)))
  ;
  
  @Effect()
  removeZonePref$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.REMOVE_ZONE_PREF)
    .map((action: PlatformAction.RemoveZonePrefAction) => action.payload)
    .mergeMap(zonePref => this.platformService.removeZonePref(zonePref))
    .map((zonePref:ZonePreference) => new PlatformAction.RemoveZonePrefSuccessAction(zonePref))
    .catch((error) => of(new PlatformAction.RemovePlatformFailAction(error)))
  ;
  
  @Effect()
  removeCount$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.REMOVE_COUNT)
    .map((action: PlatformAction.RemoveCountAction) => action.payload)
    .mergeMap(count => this.platformService.removeCount(count))
    .map((count:Count) => new PlatformAction.RemoveCountSuccessAction(count))
    .catch((error) => of(new PlatformAction.RemovePlatformFailAction(error)))
  ;

  @Effect() 
  addPlatformSuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_PLATFORM_SUCCESS)
    .map((action: PlatformAction.AddPlatformSuccessAction) => action.payload)
    .mergeMap((platform: Platform) => this.router.navigate(['/platform/' + platform._id]))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction());

  @Effect() 
  importOrRemovePlatformSuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_PLATFORM_SUCCESS,PlatformAction.ActionTypes.REMOVE_PLATFORM_SUCCESS)
    .do(() => this.router.navigate(['/platform']))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction());

   @Effect() 
  removePlatformCountrySuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.REMOVE_PLATFORM_COUNTRY_SUCCESS)
    .map(() => new PlatformAction.RemoveMsgAction());

  @Effect() 
  addZoneSuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_ZONE_SUCCESS)
    .map((action: PlatformAction.AddZoneSuccessAction) => action.payload)
    .mergeMap((zone: Zone) => this.router.navigate(['/zone/' + zone.codePlatform + '/' + zone.properties.code]))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction());

  @Effect() 
  importOrRemoveZoneSuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_ZONE_SUCCESS, PlatformAction.ActionTypes.REMOVE_ZONE_SUCCESS)
    .map((action: PlatformAction.ImportZoneSuccessAction | PlatformAction.RemoveZoneSuccessAction) => action.payload)
    .mergeMap((zone: Zone) => this.router.navigate(['/platform/' + zone.codePlatform+'/zones']))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction());

  @Effect() 
  addSurveySuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_SURVEY_SUCCESS)
    .map((action: PlatformAction.AddSurveySuccessAction) => action.payload)
    .mergeMap((survey: Survey) => this.router.navigate(['/survey/' + survey.codePlatform + '/'+ survey.code]))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction()); 

  @Effect() 
  importOrRemoveSurveySuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_SURVEY_SUCCESS, PlatformAction.ActionTypes.REMOVE_SURVEY_SUCCESS)
    .map((action: PlatformAction.ImportSurveySuccessAction | PlatformAction.RemoveSurveySuccessAction) => action.payload)
    .mergeMap((survey: Survey) => this.router.navigate(['/platform/' + survey.codePlatform]))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction());

  @Effect() 
  addZonePrefSuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_ZONE_PREF_SUCCESS)
    .map((action: PlatformAction.AddZonePrefSuccessAction) => action.payload)
    .mergeMap((zonePref: ZonePreference) => this.router.navigate(['/zonePref/' + zonePref.codePlatform + '/'+ zonePref.codeZone + '/' + zonePref.code]))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction()); 

  @Effect() 
  importOrRemoveZonePrefSuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_ZONE_PREF_SUCCESS, PlatformAction.ActionTypes.REMOVE_ZONE_PREF_SUCCESS)
    .map((action: PlatformAction.ImportZonePrefSuccessAction | PlatformAction.RemoveZonePrefSuccessAction) => action.payload)
    .mergeMap((zonePref: ZonePreference) => this.router.navigate(['/zone/' + zonePref.codePlatform + '/'+ zonePref.codeZone+'/zonesPref']))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction());

  @Effect() 
  addTransectSuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_TRANSECT_SUCCESS)
    .map((action: PlatformAction.AddTransectSuccessAction) => action.payload)
    .mergeMap((transect: Transect) => this.router.navigate(['/transect/' + transect.codePlatform + '/'+ transect.codeZone + '/' + transect.properties.code]))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction()); 

  @Effect() 
  importOrRemoveTransectSuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_TRANSECT_SUCCESS, PlatformAction.ActionTypes.REMOVE_TRANSECT_SUCCESS)
    .map((action: PlatformAction.ImportTransectSuccessAction | PlatformAction.RemoveTransectSuccessAction) => action.payload)
    .mergeMap((transect: Transect) => this.router.navigate(['/zone/' + transect.codePlatform + '/'+ transect.codeZone]))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction());

  @Effect() 
  addCountSuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.ADD_COUNT_SUCCESS)
    .map((action: PlatformAction.AddCountSuccessAction) => action.payload)
    .mergeMap((count:Count) => this.router.navigate(['/count/' + count.codePlatform + '/' + count.codeSurvey + '/' + count.code]))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction());

  @Effect() 
  importOrRemoveCountSuccess$: Observable<Action> = this.actions$
    .ofType(PlatformAction.ActionTypes.IMPORT_COUNT_SUCCESS, PlatformAction.ActionTypes.REMOVE_COUNT_SUCCESS)
    .map((action: PlatformAction.ImportCountSuccessAction | PlatformAction.RemoveCountSuccessAction) => action.payload)
    .mergeMap((count:Count) => this.router.navigate(['/survey/' + count.codePlatform + '/'+ count.codeSurvey]))
    .delay(3000)
    .map(() => new PlatformAction.RemoveMsgAction());
    


  constructor(private actions$: Actions, private store: Store<IAppState>, private router: Router, private platformService: PlatformService, private csv2jsonService: Csv2JsonService) {


  }
}
