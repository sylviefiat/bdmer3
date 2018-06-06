import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { defer, Observable, pipe, of, from } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, withLatestFrom, startWith, tap, exhaustMap } from 'rxjs/operators';

import { IAppState, getLatestURL } from '../../ngrx/index';
import { CountriesService, MailService } from '../../core/services/index';
import { AuthService } from '../../core/services/auth.service';
import { AuthAction } from '../actions/index';
import { Authenticate, AuthInfo, AccessToken } from '../models/user';
import { User, Country } from '../../countries/models/country';
import { CountryAction } from '../../countries/actions/index';

@Injectable()
export class AuthEffects {

  public static readonly tokenItem = 'token';
  public static readonly expirationTime = 60*60*1000;  // setup 10min before login expiration

  @Effect() login$ = this.actions$
    .ofType<AuthAction.Login>(AuthAction.ActionTypes.LOGIN)
    .pipe(
      map((action: AuthAction.Login) => action.payload),
      exhaustMap(auth => this.authService.login(auth)),
      map((result: AccessToken) => {
            const authInfoUpdated: AuthInfo = {
              access_token: result,
              expires_in: AuthEffects.expirationTime,
              expires: Math.floor((Date.now()+AuthEffects.expirationTime) / 1000)
            }
            localStorage.setItem(AuthEffects.tokenItem, JSON.stringify(authInfoUpdated));
            return new AuthAction.LoginSuccess(authInfoUpdated);
          }),
      catchError(error => of(new AuthAction.LoginFailure(error.message)))
    );

  @Effect() logout$ = this.actions$
    .ofType<AuthAction.Logout>(AuthAction.ActionTypes.LOGOUT)
    .pipe(
      map((action: AuthAction.Logout) => action.payload),
      exhaustMap(stringisnull => this.authService.logout().pipe(
        map(authed => localStorage.removeItem(AuthEffects.tokenItem)),
        map(() => this.router.navigate(['/']))
      ))  
    );

  @Effect({ dispatch: false }) loginSuccess$ = this.actions$
    .ofType<AuthAction.LoginSuccess>(AuthAction.ActionTypes.LOGIN_SUCCESS)
    .pipe(
      map((action: AuthAction.LoginSuccess) => action.payload),
      withLatestFrom(this.store.select(getLatestURL)),
      map(([authInfo, url]) => [authInfo, url]),
      mergeMap((value: [any, String]) => this.router.navigate([value[1]]))
    );

  @Effect({ dispatch: false }) loginRedirect$ = this.actions$
    .ofType<AuthAction.LoginRedirect>(AuthAction.ActionTypes.LOGIN_REDIRECT)
    .pipe(tap(authed => this.router.navigate(['/login']))
  );

  @Effect() lostpassword$ = this.actions$
    .ofType<AuthAction.LostPassword>(AuthAction.ActionTypes.LOST_PASSWORD)
    .pipe(
      map((action: AuthAction.LostPassword) => action.payload),
      exhaustMap(usermail => this.countriesService.verifyMail(usermail)),
      map((user: User) => this.mailService.sendPasswordMail(user)),
      map(success => new AuthAction.LostPasswordSuccess(success)),
      catchError(error => of(new AuthAction.LostPasswordFailure(error)))  
    );

  @Effect({ dispatch: false }) lostpasswordSuccess$ = this.actions$
    .ofType<AuthAction.LostPasswordSuccess>(AuthAction.ActionTypes.LOST_PASSWORD_SUCCESS)
    .pipe(tap(() => this.router.navigate(['/login']))
  );

  @Effect({ dispatch: false }) lostpasswordRedirect$ = this.actions$
    .ofType<AuthAction.LostPasswordRedirect>(AuthAction.ActionTypes.LOST_PASSWORD_REDIRECT)
    .pipe(tap(authed => this.router.navigate(['/login']))
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private countriesService: CountriesService,
    private mailService: MailService,
    private router: Router,
    private store: Store<IAppState>
  ) { }
}