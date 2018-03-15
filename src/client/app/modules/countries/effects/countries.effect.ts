import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { Injectable, NgZone } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { of } from 'rxjs/observable/of';
import { CountriesService } from "../../core/services/index";

import { CountriesAction } from '../actions/index';
import { Country } from '../models/country';
import { CountryListService } from '../services/index';

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
    return this.countriesService.initDB('countries','http://bdmerdb:5984/');
  });

  @Effect() init$: Observable<Action> = this.actions$
    .ofType(CountriesAction.ActionTypes.INIT)
    .startWith(new CountriesAction.InitAction)
    .switchMap(() => this.countryListService.getCountryList())
    .map(payload => {
      //console.log(payload);
      let countryList = payload;
      return new CountriesAction.InitializedAction(countryList);
    })
    // nothing reacting to failure at moment but you could if you want (here for example)
    .catch(() => Observable.of(new CountriesAction.InitFailedAction()));

  @Effect()
  loadCountries$: Observable<Action> = this.actions$
    .ofType(CountriesAction.ActionTypes.LOAD)
    .switchMap(() =>     
      this.countriesService
        .getAll()
        .map((countries: Country[]) => new CountriesAction.LoadSuccessAction(countries))
        .catch(error => of(new CountriesAction.LoadFailAction(error)))
    
    );

  @Effect()
  addCountryToCountries$: Observable<Action> = this.actions$
    .ofType(CountriesAction.ActionTypes.ADD_COUNTRY)
    .map((action: CountriesAction.AddCountryAction) => action.payload)
    .mergeMap(country => 
      this.countriesService
        .addCountry(country)
        .map((country) => new CountriesAction.AddCountrySuccessAction(country))
        .catch((country) => {console.log(country);return of(new CountriesAction.AddCountryFailAction(country))})
    );

  @Effect({ dispatch: false }) addCountrySuccess$ = this.actions$
    .ofType(CountriesAction.ActionTypes.ADD_COUNTRY_SUCCESS)
    .do(() =>this.router.navigate(['/countries']));

  @Effect({ dispatch: false }) removeCountrySuccess$ = this.actions$
    .ofType(CountriesAction.ActionTypes.REMOVE_COUNTRY_SUCCESS)
    .do(() =>this.router.navigate(['/countries']));

  @Effect()
  removeCountryFromCountries$: Observable<Action> = this.actions$
    .ofType(CountriesAction.ActionTypes.REMOVE_COUNTRY)
    .map((action: CountriesAction.RemoveCountryAction) => action.payload)
    .mergeMap(country =>
      this.countriesService
        .removeCountry(country)
        .map(() => new CountriesAction.RemoveCountrySuccessAction(country))
        .catch(() => of(new CountriesAction.RemoveCountryFailAction(country)))
    );

  constructor(private actions$: Actions, private router: Router, private countriesService: CountriesService, private countryListService: CountryListService) {
    
    
  }
}
