import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { Injectable, NgZone } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { of } from 'rxjs/observable/of';
import { PouchDBService } from "../../core/services/pouchdb.service";

import { CountriesAction } from '../actions/index';
import { Country } from '../models/country';

@Injectable()
export class CountriesEffects {
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
    return this.database.initDB('countries','http://entropie-dev:5984/');
  });

  @Effect()
  loadCountries$: Observable<Action> = this.actions$
    .ofType(CountriesAction.ActionTypes.LOAD)
    .switchMap(() =>     
      this.database
        .getAll()
        .map((countries: Country[]) => new CountriesAction.LoadSuccessAction(countries))
        .catch(error => of(new CountriesAction.LoadFailAction(error)))
    
    );

  @Effect()
  addCountryToCountries$: Observable<Action> = this.actions$
    .ofType(CountriesAction.ActionTypes.ADD_COUNTRY)
    .map((action: CountriesAction.AddCountryAction) => action.payload)
    .mergeMap(country => 
      fromPromise(this.database
        .add(country))
        .map(() => new CountriesAction.AddCountrySuccessAction(country))
        .catch(() => of(new CountriesAction.AddCountryFailAction(country)))
    );

  @Effect()
  removeCountryFromCountries$: Observable<Action> = this.actions$
    .ofType(CountriesAction.ActionTypes.REMOVE_COUNTRY)
    .map((action: CountriesAction.RemoveCountryAction) => action.payload)
    .mergeMap(country =>
      fromPromise(this.database
        .delete(country))
        .map(() => new CountriesAction.RemoveCountrySuccessAction(country))
        .catch(() => of(new CountriesAction.RemoveCountryFailAction(country)))
    );

  constructor(private actions$: Actions, private database: PouchDBService) {
    
    
  }
}
