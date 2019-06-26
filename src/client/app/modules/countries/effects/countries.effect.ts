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
import { IAppState, getServiceUrl, getPrefixDatabase } from '../../ngrx/index';

@Injectable()
export class CountriesEffects {
    private basePath: string;
    private dbname;

    @Effect({ dispatch: false })
    openDB$: Observable<any> = this.actions$
        .pipe(
            ofType<AppInitAction.FinishAppInitAction>(AppInitAction.ActionTypes.FINISH_APP_INIT),
            withLatestFrom(this.store.select(getServiceUrl),this.store.select(getPrefixDatabase)),
            map((value) => this.countriesService.initDB('countries', value[1], value[2])),
            mergeMap(() => this.countriesService.getCountry(this.countriesService.adminCountry.code)),
            filter(country => !country),
            mergeMap(value => this.countriesService.insertCountry(this.countriesService.adminCountry)),
            mergeMap(value => this.countriesService.addUser(this.countriesService.adminUser))
        );

    @Effect() init$: Observable<Action> = this.actions$
        .pipe(
            ofType<CountriesAction.InitAction>(CountriesAction.ActionTypes.INIT),
            switchMap(init => this.countryListService.getCountryList()),
            withLatestFrom(this.countryListService.getCountryListDetails()),
            withLatestFrom(this.countryListService.getCountryListCount()),
            withLatestFrom(this.countryListService.getPlatformTypeList()),
            map(([[[countryList, countryListDetails], countryListCount], platformTypeList]) => 
                new CountriesAction.InitializedAction({countryList: countryList, countryListDetails: countryListDetails, countryListCount: countryListCount, platformTypeList: platformTypeList })),      
            catchError((error) => of(new CountriesAction.InitFailedAction()))
        );

    @Effect()
    loadCountries$: Observable<Action> = this.actions$
        .pipe(
            ofType<CountriesAction.LoadAction>(CountriesAction.ActionTypes.LOAD),
            switchMap(load => this.countriesService.getAll()),
            map((countries: Country[]) => new CountriesAction.LoadSuccessAction(countries)),
            catchError(error => of(new CountriesAction.LoadFailAction(error)))
        );

    @Effect()
    addCountryToCountries$: Observable<Action> = this.actions$
        .pipe(
            ofType<CountriesAction.AddCountryAction>(CountriesAction.ActionTypes.ADD_COUNTRY),
            map((action: CountriesAction.AddCountryAction) => action.payload),
            mergeMap(country => this.countriesService.addCountry(country)),
            map((country) => new CountriesAction.AddCountrySuccessAction(country)),
            catchError((country) => of(new CountriesAction.AddCountryFailAction(country)))
        );

    @Effect({ dispatch: false }) addCountrySuccess$ = this.actions$
        .pipe(
            ofType<CountriesAction.AddCountrySuccessAction>(CountriesAction.ActionTypes.ADD_COUNTRY_SUCCESS),
            tap(() => this.router.navigate(['/countries']))
        );
    @Effect({ dispatch: false }) removeCountrySuccess$ = this.actions$
        .pipe(
            ofType<CountriesAction.AddCountryFailAction>(CountriesAction.ActionTypes.REMOVE_COUNTRY_SUCCESS),
            tap(() => this.router.navigate(['/countries']))
        );
    @Effect()
    removeCountryFromCountries$: Observable<Action> = this.actions$
        .pipe(
            ofType<CountriesAction.RemoveCountryAction>(CountriesAction.ActionTypes.REMOVE_COUNTRY),
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