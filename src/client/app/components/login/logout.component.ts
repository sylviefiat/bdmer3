import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../modules/ngrx/index';
import { AuthAction } from '../../modules/auth/actions/index';

@Component({
  template: ''
})

export class LogoutComponent implements OnInit {

  constructor(private store: Store<IAppState>) {}

  ngOnInit() {
    this.store.dispatch(new AuthAction.Logout("get out boy"));
  }

}