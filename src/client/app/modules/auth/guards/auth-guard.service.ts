import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AuthAction } from '../actions/index';
import { IAppState, getLoggedIn } from '../../ngrx/index';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private store: Store<IAppState>) {}

  canActivate(): Observable<boolean> {    

    return this.store.let(getLoggedIn).take(1).map(authed => {
      console.log(authed);
      if (!authed) {
        this.store.dispatch(new AuthAction.LoginRedirect());
        return false;
      }

      return true;
    });
  }
}