import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';

import { of } from 'rxjs/observable/of';
import { CountriesService } from "../../core/services/index";
import { AuthService } from "../../core/services/index";

import { CountryAction } from '../actions/index';
import { Country, User } from '../models/country';
import { IAppState, getSelectedCountry } from '../../ngrx/index';
import { PlatformAction } from '../../datas/actions/index';


@Injectable()
export class CountryEffects {
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

  @Effect()
  addUserToCountry$: Observable<Action> = this.actions$
    .ofType(CountryAction.ActionTypes.ADD_USER)
    .map((action: CountryAction.AddUserAction) => action.payload)
    .mergeMap(user =>
      this.authService
        .signup(user))
    .mergeMap(user =>
      this.countriesService
        .addUser(user))
    .map((country) => new CountryAction.AddUserSuccessAction(country))
    .catch((country) => of(new CountryAction.AddUserFailAction(country))

    );

  @Effect()
  removeUserFromCountry$: Observable<Action> = this.actions$
    .ofType(CountryAction.ActionTypes.REMOVE_USER)
    .map((action: CountryAction.RemoveUserAction) => action.payload)
    .mergeMap(user =>
      this.authService
        .remove(user))
    .mergeMap(user =>
      this.countriesService
        .removeUser(user))
    .map((country) => new CountryAction.RemoveUserSuccessAction(country))
    .catch((country) => of(new CountryAction.RemoveUserFailAction(country))
    );

  @Effect({ dispatch: false }) addUserSuccess$ = this.actions$
    .ofType(CountryAction.ActionTypes.ADD_USER_SUCCESS)
    .map((action: CountryAction.AddUserSuccessAction) => action.payload)
    .mergeMap((country: Country) => this.router.navigate(['/countries/' + country.code]))
    .delay(3000)
    .map(() => this.store.dispatch(new CountryAction.RemoveMsgAction())); 

  @Effect({ dispatch: false }) removeUserSuccess$ = this.actions$
    .ofType(CountryAction.ActionTypes.REMOVE_USER_SUCCESS)
    .do(() => console.log("remove user success"))
    .delay(3000)
    .map(() => this.store.dispatch(new CountryAction.RemoveMsgAction())); 

  @Effect({ dispatch: false }) select$ = this.actions$
    .ofType(CountryAction.ActionTypes.SELECT)
    .map(() => this.store.dispatch(new CountryAction.LoadAction()));

  @Effect({ dispatch: false }) selectUser$ = this.actions$
    .ofType(CountryAction.ActionTypes.SELECT_USER)
    .map(() => this.store.dispatch(new CountryAction.LoadUserAction()));

  constructor(
    private actions$: Actions,
    private store: Store<IAppState>,
    private router: Router,
    private countriesService: CountriesService,
    private authService: AuthService,
    public location: Location) {


  }
}
