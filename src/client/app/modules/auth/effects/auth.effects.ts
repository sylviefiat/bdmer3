import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { defer, Observable, pipe, of, from } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, withLatestFrom, startWith, tap, exhaustMap } from 'rxjs/operators';

import { IAppState, getLatestURL, getServiceUrl, getPrefixDatabase} from '../../ngrx/index';
import { CountriesService, MailService } from '../../core/services/index';
import { AuthService } from '../../core/services/auth.service';
import { AppInitAction } from '../../core/actions/app.action';
import { AuthAction } from '../actions/index';
import { Authenticate, AuthInfo, AccessToken } from '../models/user';
import { User, Country } from '../../countries/models/country';
import { CountryAction, CountriesAction } from '../../countries/actions/index';


@Injectable()
export class AuthEffects {

    public static readonly tokenItem = 'token';
    public static readonly expirationTime = 60 * 60 * 1000;  // setup 10min before login expiration

  @Effect()
  openDB$: Observable<any> = this.actions$
    .pipe(
      ofType<AppInitAction.FinishAppInitAction>(AppInitAction.ActionTypes.FINISH_APP_INIT),
      map((action: AppInitAction.FinishAppInitAction) => action.payload),
      withLatestFrom(this.store.select(getServiceUrl)),
      map((value) => this.authService.initDB('_users',value[1])),
      map((db) => {        
        //this.authService.login({username:'admin', password:'admin'});
        //let token = JSON.parse(localStorage.getItem('token'));
        /*if (token && token.expires > Math.floor(Date.now() / 1000)){*/
        //  return new AuthAction.LoginSuccess(token);
        /*} else if (token) {
           return new AuthAction.Logout(token);
        } else {
          return new AuthAction.AnonymousUse();
        }*/
        return new AuthAction.Login({username:'admin', password:'admin'});
      })
    );

    @Effect() login$ = this.actions$
        .pipe(
            ofType<AuthAction.Login>(AuthAction.ActionTypes.LOGIN),
            map((action: AuthAction.Login) => action.payload),
            exhaustMap(auth => this.authService.login(auth)),
            map((result: AccessToken) => {
                const authInfoUpdated: AuthInfo = {
                    access_token: result,
                    expires_in: AuthEffects.expirationTime,
                    expires: Math.floor((Date.now() + AuthEffects.expirationTime) / 1000)
                }
                localStorage.setItem(AuthEffects.tokenItem, JSON.stringify(authInfoUpdated));
                return new AuthAction.LoginSuccess(authInfoUpdated);
            }),
            catchError(error => of(new AuthAction.LoginFailure(error.message)))
        );

    @Effect({dispatch:false}) logout$ = this.actions$
        .pipe(
            ofType<AuthAction.Logout>(AuthAction.ActionTypes.LOGOUT),
            map((action: AuthAction.Logout) => action.payload),
            exhaustMap(stringisnull => this.authService.logout().pipe(
                tap(authed => localStorage.removeItem(AuthEffects.tokenItem)),
                tap(() => this.router.navigate(['/']))
            ))
        );

    @Effect({ dispatch: false }) loginSuccess$ = this.actions$
        .pipe(
            ofType<AuthAction.LoginSuccess>(AuthAction.ActionTypes.LOGIN_SUCCESS),
            map((action: AuthAction.LoginSuccess) => action.payload),
            withLatestFrom(this.store.select(getLatestURL)),
            map(([authInfo, url]) => [authInfo, url]),
            mergeMap((value: [any, String]) => {
                if (value[0].access_token.country.code !== 'AA') {
                    this.store.dispatch(new CountryAction.SelectAction(value[0].access_token.country.code));
                }
                return this.router.navigate([value[1]])
            })
        );

    @Effect({ dispatch: false }) loginRedirect$ = this.actions$
        .pipe(
            ofType<AuthAction.LoginRedirect>(AuthAction.ActionTypes.LOGIN_REDIRECT),
            tap(authed => this.router.navigate(['/login']))
        );

    @Effect() lostpassword$ = this.actions$
        .pipe(
            ofType<AuthAction.LostPassword>(AuthAction.ActionTypes.LOST_PASSWORD),
            map((action: AuthAction.LostPassword) => action.payload),
            exhaustMap(usermail => this.countriesService.verifyMail(usermail)),
            map((user: User) => this.mailService.sendPasswordMail(user)),
            map(success => new AuthAction.LostPasswordSuccess(success)),
            catchError(error => of(new AuthAction.LostPasswordFailure(error)))
        );

    @Effect({ dispatch: false }) lostpasswordSuccess$ = this.actions$
        .pipe(
            ofType<AuthAction.LostPasswordSuccess>(AuthAction.ActionTypes.LOST_PASSWORD_SUCCESS),
            tap(() => this.router.navigate(['/login']))
        );

    @Effect({ dispatch: false }) lostpasswordRedirect$ = this.actions$
        .pipe(
            ofType<AuthAction.LostPasswordRedirect>(AuthAction.ActionTypes.LOST_PASSWORD_REDIRECT),
            tap(authed => this.router.navigate(['/login']))
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