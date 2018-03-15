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

import { IAppState, getSelectedCountry, getSelectedSite, getSelectedZone } from '../../ngrx/index';
import { Csv2JsonService } from "../../core/services/csv2json.service";
import { SiteService } from "../services/site.service";
import { SiteAction } from '../actions/index';
import { Site, Zone, Transect, Count, Campaign, ZonePreference } from '../models/site';
import { Country } from '../../countries/models/country';

@Injectable()
export class SiteEffects {
  /**
   * This effect does not yield any actions back to the store. Set
   * `dispatch` to false to hint to @ngrx/effects that it should
   * ignore any elements of this effect stream.
   *
   * The `defer` observable accepts an observable factory function
   * that is called when the observable is subscribed to.
   * Wrapping the database open call in `defer` makes
   * effect easier to test.
   */
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => {
    return this.siteService.initDB('sites', 'http://bdmerdb:5984/');
  });

  @Effect()
  loadSites$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.LOAD)
    .switchMap(() =>
      this.siteService
        .getAll()
        .map((sites: Site[]) => new SiteAction.LoadSuccessAction(sites))
        .catch(error => of(new SiteAction.LoadFailAction(error)))
    );

  @Effect()
  addSite$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_SITE)
    .map((action: SiteAction.AddSiteAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedCountry))    
    .mergeMap((value: [Site, Country]) => this.siteService.editSite(value[0], value[1]))
    .map((site: Site) => new SiteAction.AddSiteSuccessAction(site))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)))
  ;

  @Effect()
  addZone$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_ZONE)
    .map((action: SiteAction.AddZoneAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedSite))
    .mergeMap((value: [Zone, Site]) => this.siteService.editZone(value[1], value[0]))
    .map((zone: Zone) => new SiteAction.AddZoneSuccessAction(zone))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)))
  ;

  @Effect() 
  addCampaign$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_CAMPAIGN)
    .map((action: SiteAction.AddCampaignAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedSite))
    .mergeMap((value: [Campaign, Site]) => this.siteService.editCampaign(value[1], value[0]))
    .map((campaign: Campaign) => new SiteAction.AddCampaignSuccessAction(campaign))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)))
  ;

  @Effect() 
  addTransect$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_TRANSECT)
    .map((action: SiteAction.AddTransectAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedSite))
    .mergeMap((value: [Transect, Site]) => this.siteService.editTransect(value[1], value[0]))
    .map((transect: Transect) => new SiteAction.AddTransectSuccessAction(transect))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)))
  ;

  @Effect() 
  addZonePref$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_ZONE_PREF)
    .map((action: SiteAction.AddZonePrefAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedSite))
    .mergeMap((value: [ZonePreference, Site]) => this.siteService.editZonePref(value[1], value[0]))
    .map((zonePref: ZonePreference) => new SiteAction.AddZonePrefSuccessAction(zonePref))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)))
  ;

  @Effect() 
  addCount$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_COUNT)
    .map((action: SiteAction.AddCountAction) => action.payload)
    .withLatestFrom(this.store.let(getSelectedSite))
    .mergeMap((value: [Count, Site]) => this.siteService.editCount(value[1], value[0]))
    .map((count: Count) => new SiteAction.AddCountSuccessAction(count))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)))
  ;

  @Effect()
  importSite$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_SITE)    
    .map((action: SiteAction.ImportSiteAction) => action.payload)
    .mergeMap((site: Site) => this.csv2jsonService.csv2('site', site))
    .withLatestFrom(this.store.let(getSelectedCountry))
    // fait automatiquement une boucle sur les sites retournés
    .mergeMap((value: [Site, Country]) => this.siteService.editSite(value[0], value[1]))
    .map((site: Site) => new SiteAction.ImportSiteSuccessAction(site))
    .catch(error => of(new SiteAction.AddSiteFailAction(error)))
  ;

  @Effect()
  importZone$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_ZONE)    
    .map((action: SiteAction.ImportZoneAction) => action.payload)
    .mergeMap((zone: Zone) => this.csv2jsonService.csv2('zone', zone))
    .withLatestFrom(this.store.let(getSelectedSite))
    .mergeMap((value: [Zone,Site]) => this.siteService.editZone(value[1], value[0]))    
    .map((zone: Zone) => new SiteAction.ImportZoneSuccessAction(zone))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)));

  @Effect()
  importCampaign$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_CAMPAIGN)
    .map((action: SiteAction.ImportCampaignAction) => action.payload)
    .mergeMap((campaign: Campaign) => this.csv2jsonService.csv2('campaign', campaign))
    .withLatestFrom(this.store.let(getSelectedSite))
    .mergeMap((value: [Campaign, Site]) => this.siteService.editCampaign(value[1], value[0]))
    .map((campaign: Campaign) => new SiteAction.ImportCampaignSuccessAction(campaign))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)));

  @Effect()
  importTransect$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_TRANSECT)
    .map((action: SiteAction.ImportTransectAction) => action.payload)
    .mergeMap((transect: Transect) => this.csv2jsonService.csv2('transect', transect))
    .withLatestFrom(this.store.let(getSelectedSite))
    .mergeMap((value: [Transect, Site]) => this.siteService.editTransect(value[1], value[0]))
    .map((transect: Transect) => new SiteAction.ImportTransectSuccessAction(transect))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)));

  @Effect()
  importZonePref$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_ZONE_PREF)
    .map((action: SiteAction.ImportZonePrefAction) => action.payload)
    .mergeMap((zonePref: ZonePreference) => this.csv2jsonService.csv2('zonePref', zonePref))
    .withLatestFrom(this.store.let(getSelectedSite))
    .mergeMap((value: [ZonePreference, Site]) => this.siteService.editZonePref(value[1], value[0]))
    .map((zonePref: ZonePreference) => new SiteAction.ImportZonePrefSuccessAction(zonePref))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)));

  @Effect()
  importCount$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_COUNT)
    .map((action: SiteAction.ImportCountAction) => action.payload)
    .mergeMap((count: Count) => this.csv2jsonService.csv2('count', count))
    .withLatestFrom(this.store.let(getSelectedSite))
    .mergeMap((value: [Count, Site]) => this.siteService.editCount(value[1], value[0]))
    .map((count: Count) => new SiteAction.ImportCountSuccessAction(count))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)));

  @Effect()
  removeSite$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.REMOVE_SITE)
    .map((action: SiteAction.RemoveSiteAction) => action.payload)
    .mergeMap(site => this.siteService.removeSite(site))
    .map((site:Site) => new SiteAction.RemoveSiteSuccessAction(site))
    .catch((error) => of(new SiteAction.RemoveSiteFailAction(error)))
  ;
  
  @Effect()
  removeZone$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.REMOVE_ZONE)
    .map((action: SiteAction.RemoveZoneAction) => action.payload)
    .mergeMap(zone => this.siteService.removeZone(zone))
    .map((zone:Zone) => new SiteAction.RemoveZoneSuccessAction(zone))
    .catch((error) => of(new SiteAction.RemoveSiteFailAction(error)))
  ;
  
  @Effect()
  removeCampaign$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.REMOVE_CAMPAIGN)
    .map((action: SiteAction.RemoveCampaignAction) => action.payload)
    .mergeMap(campaign => this.siteService.removeCampaign(campaign))
    .map((campaign:Campaign) => new SiteAction.RemoveCampaignSuccessAction(campaign))
    .catch((error) => of(new SiteAction.RemoveSiteFailAction(error)))
  ;
  
  @Effect()
  removeTransect$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.REMOVE_TRANSECT)
    .map((action: SiteAction.RemoveTransectAction) => action.payload)
    .mergeMap(transect => this.siteService.removeTransect(transect))
    .map((transect:Transect) => new SiteAction.RemoveTransectSuccessAction(transect))
    .catch((error) => of(new SiteAction.RemoveSiteFailAction(error)))
  ;
  
  @Effect()
  removeZonePref$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.REMOVE_ZONE_PREF)
    .map((action: SiteAction.RemoveZonePrefAction) => action.payload)
    .mergeMap(zonePref => this.siteService.removeZonePref(zonePref))
    .map((zonePref:ZonePreference) => new SiteAction.RemoveZonePrefSuccessAction(zonePref))
    .catch((error) => of(new SiteAction.RemoveSiteFailAction(error)))
  ;
  
  @Effect()
  removeCount$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.REMOVE_COUNT)
    .map((action: SiteAction.RemoveCountAction) => action.payload)
    .mergeMap(count => this.siteService.removeCount(count))
    .map((count:Count) => new SiteAction.RemoveCountSuccessAction(count))
    .catch((error) => of(new SiteAction.RemoveSiteFailAction(error)))
  ;

  @Effect() 
  addSiteSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_SITE_SUCCESS)
    .map((action: SiteAction.AddSiteSuccessAction) => action.payload)
    .mergeMap((site: Site) => this.router.navigate(['/site/' + site._id]))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction());

  @Effect() 
  importOrRemoveSiteSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_SITE_SUCCESS,SiteAction.ActionTypes.REMOVE_SITE_SUCCESS)
    .do(() => this.router.navigate(['/site']))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction());

  @Effect() 
  addZoneSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_ZONE_SUCCESS)
    .map((action: SiteAction.AddZoneSuccessAction) => action.payload)
    .mergeMap((zone: Zone) => this.router.navigate(['/zone/' + zone.codeSite + '/' + zone.code]))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction());

  @Effect() 
  importOrRemoveZoneSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_ZONE_SUCCESS, SiteAction.ActionTypes.REMOVE_ZONE_SUCCESS)
    .map((action: SiteAction.ImportZoneSuccessAction | SiteAction.RemoveZoneSuccessAction) => action.payload)
    .mergeMap((zone: Zone) => this.router.navigate(['/site/' + zone.codeSite+'/zones']))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction());

  @Effect() 
  addCampaignSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_CAMPAIGN_SUCCESS)
    .map((action: SiteAction.AddCampaignSuccessAction) => action.payload)
    .mergeMap((campaign: Campaign) => this.router.navigate(['/campaign/' + campaign.codeSite + '/'+ campaign.code]))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction()); 

  @Effect() 
  importOrRemoveCampaignSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_CAMPAIGN_SUCCESS, SiteAction.ActionTypes.REMOVE_CAMPAIGN_SUCCESS)
    .map((action: SiteAction.ImportCampaignSuccessAction | SiteAction.RemoveCampaignSuccessAction) => action.payload)
    .mergeMap((campaign: Campaign) => this.router.navigate(['/site/' + campaign.codeSite]))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction());

  @Effect() 
  addZonePrefSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_ZONE_PREF_SUCCESS)
    .map((action: SiteAction.AddZonePrefSuccessAction) => action.payload)
    .mergeMap((zonePref: ZonePreference) => this.router.navigate(['/zonePref/' + zonePref.codeSite + '/'+ zonePref.codeZone + '/' + zonePref.code]))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction()); 

  @Effect() 
  importOrRemoveZonePrefSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_ZONE_PREF_SUCCESS, SiteAction.ActionTypes.REMOVE_ZONE_PREF_SUCCESS)
    .map((action: SiteAction.ImportZonePrefSuccessAction | SiteAction.RemoveZonePrefSuccessAction) => action.payload)
    .mergeMap((zonePref: ZonePreference) => this.router.navigate(['/zone/' + zonePref.codeSite + '/'+ zonePref.codeZone+'/zonesPref']))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction());

  @Effect() 
  addTransectSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_TRANSECT_SUCCESS)
    .map((action: SiteAction.AddTransectSuccessAction) => action.payload)
    .mergeMap((transect: Transect) => this.router.navigate(['/transect/' + transect.codeSite + '/'+ transect.codeZone + '/' + transect.code]))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction()); 

  @Effect() 
  importOrRemoveTransectSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_TRANSECT_SUCCESS, SiteAction.ActionTypes.REMOVE_TRANSECT_SUCCESS)
    .map((action: SiteAction.ImportTransectSuccessAction | SiteAction.RemoveTransectSuccessAction) => action.payload)
    .mergeMap((transect: Transect) => this.router.navigate(['/zone/' + transect.codeSite + '/'+ transect.codeZone]))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction());

  @Effect() 
  addCountSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_COUNT_SUCCESS)
    .map((action: SiteAction.AddCountSuccessAction) => action.payload)
    .mergeMap((count:Count) => this.router.navigate(['/count/' + count.codeSite + '/' + count.codeCampaign + '/' + count.code]))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction());

  @Effect() 
  importOrRemoveCountSuccess$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_COUNT_SUCCESS, SiteAction.ActionTypes.REMOVE_COUNT_SUCCESS)
    .map((action: SiteAction.ImportCountSuccessAction | SiteAction.RemoveCountSuccessAction) => action.payload)
    .mergeMap((count:Count) => this.router.navigate(['/campaign/' + count.codeSite + '/'+ count.codeCampaign]))
    .delay(3000)
    .map(() => new SiteAction.RemoveMsgAction());
    


  constructor(private actions$: Actions, private store: Store<IAppState>, private router: Router, private siteService: SiteService, private csv2jsonService: Csv2JsonService) {


  }
}
