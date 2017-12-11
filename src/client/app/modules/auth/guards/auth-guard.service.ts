import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Authenticate } from '../../auth/models/user';
import { AuthAction } from '../actions/index';
import { IAppState, getisLoggedIn } from '../../ngrx/index';

@Injectable()
export class AuthGuard implements CanActivate,OnInit {
  
  constructor(private store: Store<IAppState>)  {}

  ngOnInit() {
    console.log("here");
    this.store.dispatch(new AuthAction.Session(true));
  }

  canActivate(): Observable<boolean> {    

    return this.store.let(getisLoggedIn).take(1).map(authed => {
      console.log(authed);
      if (!authed) {
        this.store.dispatch(new AuthAction.LoginRedirect());
        return false;
      }

      return true;
    });
  }
}