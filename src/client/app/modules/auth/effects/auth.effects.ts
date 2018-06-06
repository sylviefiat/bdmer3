import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { IAppState, getLatestURL } from '../../ngrx/index';
import { CountriesService, MailService } from '../../core/services/index';
import { AuthService } from '../../core/services/auth.service';
import { AuthAction } from '../actions/index';
import { Authenticate, AuthInfo, AccessToken } from '../models/user';
import { User, Country } from '../../countries/models/country';
import { CountryAction, CountriesAction } from '../../countries/actions/index';


@Injectable()
export class AuthEffects {

  public static readonly tokenItem = 'token';
  public static readonly expirationTime = 60*60*1000;  // setup 10min before login expiration

  @Effect() login$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOGIN)
    .map((action: AuthAction.Login) => action.payload)
    .exhaustMap((auth: Authenticate) => {
      return this.authService
        .login(auth)
        .map((result: AccessToken) => {
          const authInfoUpdated: AuthInfo = {
            access_token: result,
            expires_in: AuthEffects.expirationTime,
            expires: Math.floor((Date.now()+AuthEffects.expirationTime) / 1000)
          }
          localStorage.setItem(AuthEffects.tokenItem, JSON.stringify(authInfoUpdated));
          return new AuthAction.LoginSuccess(authInfoUpdated);
        })
        .catch(error => of(new AuthAction.LoginFailure(error.message)))    
    });

  @Effect() logout$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOGOUT)
    .map((action: AuthAction.Logout) => action.payload)
    .exhaustMap(stringisnull =>
      this.authService.logout()
        .do(authed => {
          localStorage.removeItem(AuthEffects.tokenItem);
          this.router.navigate(['/']);
        }));

  @Effect({ dispatch: false }) loginSuccess$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOGIN_SUCCESS)
    .withLatestFrom(this.store.let(getLatestURL))
    .map(([action, url]) => [action.payload, url])
    .mergeMap((value: [any, String]) => {   
      if(value[0].access_token.country.code!=='AA'){
        this.store.dispatch(new CountryAction.SelectAction(value[0].access_token.country.code));
      }
      return this.router.navigate([value[1]])
    });

  /*@Effect() loginSession$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOGIN_SESSION)
    .map((action: AuthAction.Session) => action.payload)
    .exhaustMap(() => {
      return this.authService
        .session()
        .map((result: { user: User, country: Country }) => {
          console.log("login session");
          return new AuthAction.LoginSuccess({ user: result.user, country: result.country })
        })
        .catch(error => of(new AuthAction.LoginFailure(error.message)))
    });*/

  @Effect({ dispatch: false }) loginRedirect$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOGIN_REDIRECT)
    .do(authed => {
      return this.router.navigate(['/login']);
    });

  @Effect() lostpassword$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOST_PASSWORD)
    .map((action: AuthAction.LostPassword) => action.payload)
    .exhaustMap(usermail =>
      this.countriesService
        .verifyMail(usermail)
        .map((user: User) => {
          return this.mailService.sendPasswordMail(user);
        })
        .map(success => new AuthAction.LostPasswordSuccess(success))
        .catch(error => of(new AuthAction.LostPasswordFailure(error)))
    );

  @Effect({ dispatch: false }) lostpasswordSuccess$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOST_PASSWORD_SUCCESS)
    .do(() => this.router.navigate(['/login']));

  @Effect({ dispatch: false }) lostpasswordRedirect$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOST_PASSWORD_REDIRECT)
    .do(authed => {
      this.router.navigate(['/login']);
    });

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private countriesService: CountriesService,
    private mailService: MailService,
    private router: Router,
    private store: Store<IAppState>
  ) { }
}