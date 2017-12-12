import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skipUntil';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { Authenticate } from '../../auth/models/user';
import { AuthAction } from '../actions/index';
import { IAppState, getisLoggedIn, getisSessionLoaded } from '../../ngrx/index';

@Injectable()
export class AuthGuard implements CanActivate, OnInit {
  actionsSubscription: Subscription;

  constructor(private store: Store<IAppState>, private router: Router) { }

  ngOnInit() {
    this.store.dispatch(new AuthAction.Session(true));
    /*this.actionsSubscription = this.store.let(getisLoggedIn)
      .filter((logged:boolean) => !logged)
      .map((logged:boolean) => new AuthAction.Session(true))
      .subscribe(this.store);*/
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.let(getisLoggedIn).take(1).map(authed => {
      if (!authed) {
        this.store.dispatch(new AuthAction.LoginRedirect(state.url));
        return false;
      }
      return true;
    });
  }
  
} 