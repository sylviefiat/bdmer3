import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getSelectedCountry, getAuthUser } from '../../modules/ngrx/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { Country, User } from '../../modules/countries/models/country';

@Component({
  selector: 'bc-selected-country-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-country-detail
      [country]="country$ | async"
      [currentUser]="currentUser$ | async"
      (removecountry)="removeFromCountries($event)">
    </bc-country-detail>
  `,
})
export class SelectedCountryPageComponent implements OnInit {
  country$: Observable<Country>;
  currentUser$: Observable<User>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {            
  }

  ngOnInit() {
    this.store.dispatch(new CountriesAction.LoadAction()); 
    this.country$ = this.store.let(getSelectedCountry);
    this.currentUser$ = this.store.let(getAuthUser);
  }

  removeFromCountries(country: Country) {
    this.store.dispatch(new CountriesAction.RemoveCountryAction(country));
  }
}
