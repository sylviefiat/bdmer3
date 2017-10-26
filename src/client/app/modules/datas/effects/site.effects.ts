import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';

import { Csv2JsonService } from "../../core/services/csv2json.service";
import { SiteService } from "../services/site.service";
import { SiteAction } from '../actions/index';
import { Site } from '../models/site';

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
    console.log("openDB sites");
    return this.siteService.initDB('sites','http://entropie-dev:5984/');
  });

  @Effect()
  loadSites$: Observable<Action> = this.actions$
    .ofType(SiteAction.ActionTypes.LOAD)
    .switchMap(() =>     
      this.siteService
        .getAll()
        .map((site: Site[]) => new SiteAction.LoadSuccessAction(site))
        .catch(error => of(new SiteAction.LoadFailAction(error)))    
    );

  @Effect()
  addSiteToList$: Observable<Action> = this.actions$
    //.do((action) => console.log(`Received ${action.type}`))
    //.filter((action) => action.type === SiteAction.ActionTypes.ADD_SITE)
    .ofType(SiteAction.ActionTypes.ADD_SITE)
    .map((action: SiteAction.AddSiteAction) => action.payload)
    .mergeMap(site => 
      this.siteService
        .editSite(site)
        .map((site: Site) => new SiteAction.AddSiteSuccessAction(site))
        .catch((error) => of(new SiteAction.AddSiteFailAction(error)))
    ).share();

  @Effect()
  importSiteToList$: Observable<Action> = this.actions$
    //.do((action) => console.log(`Received ${action.type}`))
    //.filter((action) => action.type === SiteAction.ActionTypes.IMPORT_SITE)
    .ofType(SiteAction.ActionTypes.IMPORT_SITE)
    .map((action: SiteAction.ImportSiteAction) => action.payload)
    .mergeMap(sitesCsv => this.csv2jsonService.csv2Site(sitesCsv))
    .mergeMap((site) => {
      return this.siteService
        .editSite(site)
      })
    .map((site: Site) => new SiteAction.ImportSiteSuccessAction(site))
    .catch((error) => of(new SiteAction.AddSiteFailAction(error)))
    
    ;

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
    .mergeMap((site) =>this.router.navigate(['/site/'+site._id]));

  @Effect({ dispatch: false }) removeSiteSuccess$ = this.actions$
    .ofType(SiteAction.ActionTypes.REMOVE_SITE_FAIL)
    .do(() =>this.router.navigate(['/management']));

  constructor(private actions$: Actions, private router: Router, private siteService: SiteService, private csv2jsonService: Csv2JsonService) {
    
    
  }
}
