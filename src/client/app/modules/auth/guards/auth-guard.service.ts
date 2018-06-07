
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OnInit } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { map, catchError, first } from 'rxjs/operators';

import { Authenticate, AuthInfo } from '../../auth/models/user';
import { AuthAction } from '../actions/index';
import { AuthEffects } from '../effects/index';
import { IAppState, getisLoggedIn, getisSessionLoaded } from '../../ngrx/index';

@Injectable()
export class AuthGuard implements CanActivate, OnInit {
  private loggedIn$: Observable<boolean>;

  constructor(private store: Store<IAppState>) {
      store.select(getisLoggedIn).subscribe(loggedIn => this.loggedIn$=of(loggedIn));
  }

  ngOnInit() {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    
    return this.loggedIn$.pipe(
      map(loggedIn => {
        if (loggedIn) {
          return true;
        } else {
          this.store.dispatch(new AuthAction.LoginRedirect(state.url));
          return false;
        }}),
      catchError((err) => {
        this.store.dispatch(new AuthAction.LoginRedirect(state.url));
        return of(false);
      }),
      first()
    );
  }
  
} 