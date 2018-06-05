import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouterExtensions, Config } from '../../modules/core/index';

import { Country } from '../../modules/countries/models/country';
import { IAppState, getCountryPageError } from '../../modules/ngrx/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
  selector: 'bc-new-country-page',
  template: `
    <bc-new-country-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async">
    </bc-new-country-form>
  `,
})
export class NewCountryPageComponent implements OnInit {
  error$: Observable<string | null>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
    this.store.dispatch(new CountriesAction.InitAction());
    this.store.dispatch(new CountriesAction.LoadAction()); 
    this.error$ = this.store.select(getCountryPageError);    
  }

  onSubmit(country: Country) {
    this.store.dispatch(new CountriesAction.AddCountryAction(country));
  }
}