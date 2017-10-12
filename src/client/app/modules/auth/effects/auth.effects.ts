import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { CountriesService, MailService } from '../../core/services/index';
import { AuthService } from '../../core/services/auth.service';
import { AuthAction } from '../actions/index';
import { User, Country } from '../../countries/models/country';


@Injectable()
export class AuthEffects {
  @Effect() login$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOGIN)
    .map((action: AuthAction.Login) => action.payload)
    .exhaustMap(auth =>
      this.authService
        .login(auth)
        .map((result: {user:User,country:Country}) => new AuthAction.LoginSuccess({user: result.user, country:result.country}))
        .catch(error => of(new AuthAction.LoginFailure(error.message)))
    );

  @Effect() logout$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOGOUT)
    .map((action: AuthAction.Logout) => action.payload)
    .exhaustMap(stringisnull =>
      this.authService.logout()
      .do(authed => {
      this.router.navigate(['/']);
    }));

  @Effect({ dispatch: false }) loginSuccess$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOGIN_SUCCESS)
    .do(() =>this.router.navigate(['/']));

  @Effect({ dispatch: false }) loginRedirect$ = this.actions$
    .ofType(AuthAction.ActionTypes.LOGIN_REDIRECT)
    .do(authed => {
      this.router.navigate(['/login']);
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
    private router: Router
  ) {}
}