
import { Injectable, NgZone } from '@angular/core';
import { defer, Observable, pipe, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, switchMap, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';

import { CountriesService } from "../../core/services/index";

import { CountriesAction } from '../actions/index';
import { Country } from '../models/country';
import { CountryListService } from '../services/index';
import { IAppState,  } from '../../ngrx/index';

import { config } from '../../../config';

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
    return this.countriesService.initDB('countries',config.urldb);
  });

  @Effect() init$: Observable<Action> = this.actions$
    .ofType<CountriesAction.InitAction>(CountriesAction.ActionTypes.INIT)
    .pipe(
      switchMap(init => this.countryListService.getCountryList()),
      withLatestFrom(this.countryListService.getCountryListDetails()),
      map(([countryList, countryListDetails]) => new CountriesAction.InitializedAction({countryList: countryList, countryListDetails: countryListDetails })),
      catchError((error) => of(new CountriesAction.InitFailedAction()))
    );

  @Effect()
  loadCountries$: Observable<Action> = this.actions$
    .ofType<CountriesAction.LoadAction>(CountriesAction.ActionTypes.LOAD)
    .pipe(
      switchMap(load => this.countriesService.getAll()),
      map((countries: Country[]) => new CountriesAction.LoadSuccessAction(countries)),
      catchError(error => of(new CountriesAction.LoadFailAction(error)))
    );

  @Effect()
  addCountryToCountries$: Observable<Action> = this.actions$
    .ofType<CountriesAction.AddCountryAction>(CountriesAction.ActionTypes.ADD_COUNTRY)
    .pipe(
      map((action: CountriesAction.AddCountryAction) => action.payload),
      mergeMap(country => this.countriesService.addCountry(country)),
      map((country) => new CountriesAction.AddCountrySuccessAction(country)),
      catchError((country) => of(new CountriesAction.AddCountryFailAction(country)))
    );

  @Effect({ dispatch: false }) addCountrySuccess$ = this.actions$
    .ofType<CountriesAction.AddCountrySuccessAction>(CountriesAction.ActionTypes.ADD_COUNTRY_SUCCESS)
    .pipe(tap(() =>this.router.navigate(['/countries']))
  );
  @Effect({ dispatch: false }) removeCountrySuccess$ = this.actions$
    .ofType<CountriesAction.AddCountryFailAction>(CountriesAction.ActionTypes.REMOVE_COUNTRY_SUCCESS)
    .pipe(tap(() =>this.router.navigate(['/countries']))
  );
  @Effect()
  removeCountryFromCountries$: Observable<Action> = this.actions$
    .ofType<CountriesAction.RemoveCountryAction>(CountriesAction.ActionTypes.REMOVE_COUNTRY)
    .pipe(
      map((action: CountriesAction.RemoveCountryAction) => action.payload),
      mergeMap(country => this.countriesService.removeCountry(country)),
      map((country) => new CountriesAction.RemoveCountrySuccessAction(country)),
      catchError((country) => of(new CountriesAction.RemoveCountryFailAction(country)))
    );

  constructor(private actions$: Actions, private router: Router, private countriesService: CountriesService, private countryListService: CountryListService) {


  }
}
