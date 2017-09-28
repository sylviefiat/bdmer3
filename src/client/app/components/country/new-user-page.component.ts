import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { User, Country } from '../../modules/countries/models/country';
import { IAppState, getCountryPageError, getSelectedCountry } from '../../modules/ngrx/index';
import { CountryAction } from '../../modules/countries/actions/index';

@Component({
  selector: 'bc-new-user-page',
  template: `
    <bc-new-user-form [country]="country$"
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async">
    </bc-new-user-form>
  `,
})
export class NewUserPageComponent implements OnInit {
  error$: Observable<string | null>;
  public country$: Observable<Country>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
    this.error$ = this.store.let(getCountryPageError);   
    this.country$ =this.store.let(getSelectedCountry); 
  }

  onSubmit(user: User) {
    this.store.dispatch(new CountryAction.AddUserAction(user));
  }
}