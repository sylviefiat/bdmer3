
import { Injectable, NgZone } from '@angular/core';
import { defer, Observable, pipe, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, switchMap, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';

import { CountriesService, AppService } from "../../core/services/index";
import { AppInitAction } from "../../core/actions/index";

import { CountriesAction } from '../actions/index';
import { Country } from '../models/country';
import { CountryListService } from '../services/index';
import { IAppState, getServiceUrl } from '../../ngrx/index';

@Injectable()
export class CountriesEffects {
  private basePath: string;
  private dbname;
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
  @Effect({dispatch:false})
  openDB$: Observable<any> = this.actions$    
    .ofType<AppInitAction.FinishAppInitAction>(AppInitAction.ActionTypes.FINISH_APP_INIT)
    .pipe(
      withLatestFrom(this.store.select(getServiceUrl)),
      map((value) => this.countriesService.initDB('countries', value[1]))
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
    .pipe(tap(() => this.router.navigate(['/countries']))
    );
  @Effect({ dispatch: false }) removeCountrySuccess$ = this.actions$
    .ofType<CountriesAction.AddCountryFailAction>(CountriesAction.ActionTypes.REMOVE_COUNTRY_SUCCESS)
    .pipe(tap(() => this.router.navigate(['/countries']))
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

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<IAppState>,
    private countriesService: CountriesService,
    private countryListService: CountryListService,
    private environment: AppService) {
    //this.basePath = environment.config.servicesBasePath;
    //this.dbname = "countries";

  }
}
