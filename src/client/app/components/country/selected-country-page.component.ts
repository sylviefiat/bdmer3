import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getSelectedCountry } from '../../modules/ngrx/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { Country } from '../../modules/countries/models/country';

@Component({
  selector: 'bc-selected-country-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-country-detail
      [country]="country$ | async"
      (removecountry)="removeFromCountries($event)">
    </bc-country-detail>
  `,
})
export class SelectedCountryPageComponent implements OnInit {
  country$: Observable<Country>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
    console.log("initcountry");
    this.store.dispatch(new CountriesAction.LoadAction()); 
    this.country$ = this.store.let(getSelectedCountry);   
  }

  removeFromCountries(country: Country) {
    this.store.dispatch(new CountriesAction.RemoveCountryAction(country));
  }
}
