import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { defer, Observable, pipe, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, switchMap, startWith, tap, delay } from 'rxjs/operators';
import { Location } from '@angular/common';

import { CountriesService } from "../../core/services/index";
import { AuthService } from "../../core/services/index";

import { CountryAction } from '../actions/index';
import { Country, User } from '../models/country';
import { IAppState, getSelectedCountry } from '../../ngrx/index';
import { PlatformAction } from '../../datas/actions/index';


@Injectable()
export class CountryEffects {

  @Effect()
  addUserToCountry$: Observable<Action> = this.actions$
    .ofType<CountryAction.AddUserAction>(CountryAction.ActionTypes.ADD_USER)
    .pipe(
      map((action: CountryAction.AddUserAction) => action.payload),
      mergeMap(user => this.authService.signup(user)),
      mergeMap((user: User) => this.countriesService.addUser(user)),
      map((country: Country) => new CountryAction.AddUserSuccessAction(country)),
      catchError((error) => {console.log(error);return of(new CountryAction.AddUserFailAction(error))})
    );

  @Effect()
  removeUserFromCountry$: Observable<Action> = this.actions$
    .ofType<CountryAction.RemoveUserAction>(CountryAction.ActionTypes.REMOVE_USER)
    .pipe(
      map((action: CountryAction.RemoveUserAction) => action.payload),
      mergeMap(user => this.authService.remove(user)),
      mergeMap(user => this.countriesService.removeUser(user)),
      map((country) => new CountryAction.RemoveUserSuccessAction(country)),
      catchError((country) => of(new CountryAction.RemoveUserFailAction(country)))
    );

  @Effect({ dispatch: false }) addUserSuccess$ = this.actions$
    .ofType<CountryAction.AddUserSuccessAction>(CountryAction.ActionTypes.ADD_USER_SUCCESS)
    .pipe(
      map((action: CountryAction.AddUserSuccessAction) => action.payload),
      mergeMap((country: Country) => this.router.navigate(['/countries/' + country.code])),
      delay(3000),
      map(() => this.store.dispatch(new CountryAction.RemoveMsgAction()))
    );

  @Effect({ dispatch: false }) removeUserSuccess$ = this.actions$
    .ofType<CountryAction.RemoveUserSuccessAction>(CountryAction.ActionTypes.REMOVE_USER_SUCCESS)
    .pipe(
      delay(3000),
      map(() => this.store.dispatch(new CountryAction.RemoveMsgAction()))
    );

  @Effect({ dispatch: false }) select$ = this.actions$
    .ofType<CountryAction.SelectAction>(CountryAction.ActionTypes.SELECT)
    .pipe(map(() => this.store.dispatch(new CountryAction.LoadAction()))
  );

  @Effect({ dispatch: false }) selectUser$ = this.actions$
    .ofType<CountryAction.SelectUserAction>(CountryAction.ActionTypes.SELECT_USER)
    .pipe(map(() => this.store.dispatch(new CountryAction.LoadUserAction()))
  );

  constructor(
    private actions$: Actions,
    private store: Store<IAppState>,
    private router: Router,
    private countriesService: CountriesService,
    private authService: AuthService,
    public location: Location) {


  }
}
