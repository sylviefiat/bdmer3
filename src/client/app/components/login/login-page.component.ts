import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Authenticate } from '../../modules/auth/models/user';
import { IAppState, getLoginPagePending, getLoginPageError } from '../../modules/ngrx/index';
import { AuthAction } from '../../modules/auth/actions/index';

@Component({
  selector: 'bc-login-page',
  template: `
    <bc-login-form
      (submitted)="onSubmit($event)"
      [pending]="pending$ | async"
      [errorMessage]="error$ | async">
    </bc-login-form>
  `,
  styles: [],
})
export class LoginPageComponent implements OnInit {
  pending$ = this.store.select(getLoginPagePending);
  error$ = this.store.select(getLoginPageError);

  constructor(private store: Store<IAppState>) {}

  ngOnInit() {}

  onSubmit($event: Authenticate) {
    this.store.dispatch(new AuthAction.Login($event));
  }
}