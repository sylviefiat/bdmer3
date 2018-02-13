import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getSelectedCountry, getisAdmin,getUserMessage,getUserErr } from '../../modules/ngrx/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { Country } from '../../modules/countries/models/country';

@Component({
  selector: 'bc-selected-country-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-country-detail
      [country]="country$ | async"
      [isAdmin]="isAdmin$ | async"
      [msg]="msg$ | async"
      (removecountry)="removeFromCountries($event)">
    </bc-country-detail>
  `,
})
export class SelectedCountryPageComponent implements OnInit {
  country$: Observable<Country>;
  isAdmin$: Observable<boolean>;
  msg$: Observable<string>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {            
  }

  ngOnInit() {
    this.store.dispatch(new CountriesAction.LoadAction()); 
    this.country$ = this.store.let(getSelectedCountry);
    this.isAdmin$ = this.store.let(getisAdmin);
    this.msg$ = this.store.let(getUserMessage);
  }

  removeFromCountries(country: Country) {
    this.store.dispatch(new CountriesAction.RemoveCountryAction(country));
  }
}
