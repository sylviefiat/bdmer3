import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/withLatestFrom';
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
import { Site, Zone, Transect } from '../models/site';
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
    return this.siteService.initDB('sites', 'http://entropie-dev:5984/');
  });

  @Effect()
  loadSites$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.LOAD)
    .switchMap(() =>
      this.siteService
        .getAll()
        .map((sites: Site[]) => {console.log(sites); return new SiteAction.LoadSuccessAction(sites)})
        .catch(error => of(new SiteAction.LoadFailAction(error)))
    );

  @Effect()
  addSiteToList$: Observable<Action> = this.actions$
    /*.do((action) => console.log(`Received ${action.type}`))
    .filter((action) => action.type === SiteAction.ActionTypes.ADD_SITE)*/
    .ofType(SiteAction.ActionTypes.ADD_SITE)
    .map((action: SiteAction.AddSiteAction) => action.payload)
    .mergeMap((site: Site) =>
      this.store.let(getSelectedCountry)
        .mergeMap((country: Country) => {
          site.codeCountry = country.code;
          if (!site.zones) site.zones = [];
          return this.siteService
            .editSite(site)
            .map((site: Site) => new SiteAction.AddSiteSuccessAction(site))
            .catch((error) => of(new SiteAction.AddSiteFailAction(error)))
        })
    );

  @Effect()
  addZoneToSite$: Observable<Action> = this.actions$
    /*.do((action) => console.log(`Received ${action.type}`))
    .filter((action) => action.type === SiteAction.ActionTypes.ADD_ZONE)*/
    .ofType(SiteAction.ActionTypes.ADD_ZONE)
    .withLatestFrom(this.store.let(getSelectedSite))
    .map(([action, site]) => [action.payload, site])
    .mergeMap((value: [Zone, Site]) =>
      this.siteService
        .editZone(value[1], value[0])
        .map((site: Site) => new SiteAction.AddSiteSuccessAction(site))
        .catch((error) => of(new SiteAction.AddSiteFailAction(error)))
    );

  @Effect() 
  addTransectToZone$: Observable<Action> = this.actions$
    /*.do((action) => console.log(`Received ${action.type}`))
    .filter((action) => action.type === SiteAction.ActionTypes.ADD_ZONE)*/
    .ofType(SiteAction.ActionTypes.ADD_TRANSECT)
    .withLatestFrom(this.store.let(getSelectedSite))
    .withLatestFrom(this.store.let(getSelectedZone))
    .map(([[action, site], zone]) => [action.payload, site, zone])
    .mergeMap((value: [Transect, Site, Zone]) => {
      console.log(value);
       return this.siteService
        .editTransect(value[1], value[2], value[0])
        .map((site: Site) => new SiteAction.AddSiteSuccessAction(site))
        .catch((error) => of(new SiteAction.AddSiteFailAction(error)))
    });

  @Effect()
  importSiteToList$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.IMPORT_SITE)
    .map((action: SiteAction.ImportSiteAction) => action.payload)
    .mergeMap(sitesCsv => this.csv2jsonService.csv2('site', sitesCsv))
    // fait automatiquement une boucle sur les sites retournés
    .mergeMap((site: Site) =>
      this.store.let(getSelectedCountry)
        .mergeMap((country: Country) => {
          site.codeCountry = country.code;
          if (!site.zones) site.zones = [];
          return this.siteService
            .editSite(site)
            .map((site: Site) => new SiteAction.ImportSiteSuccessAction(site))
            .catch(error => of(new SiteAction.AddSiteFailAction(error)))
        })
    );

  @Effect()
  importZoneToSite$: Observable<Action> = this.actions$
    /*.do((action) => console.log(`Received ${action.type}`))
    .filter((action) => action.type === SiteAction.ActionTypes.IMPORT_ZONE)*/
    .ofType(SiteAction.ActionTypes.IMPORT_ZONE)
    .withLatestFrom(this.store.let(getSelectedSite))
    .map(([action, site]) => [action.payload, site])
    .mergeMap((value: [any, Site]) => {
      return this.csv2jsonService.csv2('zone', value[0])
        .mergeMap(zone =>
          this.siteService
            .editZone(value[1], zone)
        )
    })
    .map((site: Site) => new SiteAction.ImportSiteSuccessAction(site))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)));

  @Effect()
  importTransectToZone$: Observable<Action> = this.actions$
    /*.do((action) => console.log(`Received ${action.type}`))
    .filter((action) => action.type === SiteAction.ActionTypes.IMPORT_TRANSECT)*/
    .ofType(SiteAction.ActionTypes.IMPORT_TRANSECT)
    .withLatestFrom(this.store.let(getSelectedSite))
    .withLatestFrom(this.store.let(getSelectedZone))
    .map(([[action, site], zone]) => [action.payload, site, zone])
    .mergeMap((value: [Transect, Site, Zone]) => {
      console.log(value);
      return this.csv2jsonService.csv2('transect', value[0])
        .mergeMap(transect => {
          console.log(value);
          return this.siteService
            .editTransect(value[1], value[2], transect)
          }        
        )
      
    })
    .map((site: Site) => new SiteAction.ImportSiteSuccessAction(site))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)));

  @Effect()
  removeSiteFromList$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.REMOVE_SITE)
    .map((action: SiteAction.RemoveSiteAction) => action.payload)
    .mergeMap(site =>
      this.siteService
        .removeSite(site)
        .map(() => new SiteAction.RemoveSiteSuccessAction(site))
        .catch(() => of(new SiteAction.RemoveSiteFailAction(site)))
    );

  @Effect({ dispatch: false }) addSiteSuccess$ = this.actions$
    .ofType(SiteAction.ActionTypes.ADD_SITE_SUCCESS)
    .map((action: SiteAction.AddSiteSuccessAction) => action.payload)
    .mergeMap((site) => this.router.navigate(['/site/' + site._id]));

  @Effect({ dispatch: false }) removeSiteSuccess$ = this.actions$
    .ofType(SiteAction.ActionTypes.REMOVE_SITE_FAIL)
    .do(() => this.router.navigate(['/site']));

  constructor(private actions$: Actions, private store: Store<IAppState>, private router: Router, private siteService: SiteService, private csv2jsonService: Csv2JsonService) {


  }
}
