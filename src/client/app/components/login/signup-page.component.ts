import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { Authenticate } from '../../modules/auth/models/user';
import { IAppState, getSignupPagePending, getSignupPageError } from '../../modules/ngrx/index';
import { AuthAction } from '../../modules/auth/actions/index';

@Component({
  selector: 'bc-signup-page',
  template: `
    <bc-signup-form
      (submitted)="onSubmit($event)"
      [pending]="pending$ | async"
      [errorMessage]="error$ | async">
    </bc-signup-form>
  `,
})
export class SignupPageComponent implements OnInit {
  pending$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
    this.pending$ = this.store.let(getSignupPagePending);
    this.error$ = this.store.let(getSignupPageError);    
  }

  onSubmit(auth: Authenticate) {
    this.store.dispatch(new AuthAction.Signup(auth));
  }
}