import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouterExtensions, Config } from '../../modules/core/index';

import { Country } from '../../modules/countries/models/country';
import { IAppState, getCountryPageError, getCountryList, getCountryListDetails, getCountriesIdsInApp} from '../../modules/ngrx/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
  selector: 'bc-new-country-page',
  template: `
    <bc-new-country-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [countryList]="countryList$ | async"
      [countryListDetails]="countryListDetails$ | async"
      [countriesIds]="countriesIds$ | async">
    </bc-new-country-form>
  `,
})
export class NewCountryPageComponent implements OnInit {
  error$: Observable<string | null>;
  countryList$: Observable<any[]>;
  countryListDetails$: Observable<any[]>;
  countriesIds$: Observable<any[]>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
    this.store.dispatch(new CountriesAction.InitAction());
    this.store.dispatch(new CountriesAction.LoadAction());
    this.error$ = this.store.select(getCountryPageError);
    this.countryList$ = this.store.select(
      getCountryList
    ) /*.pipe(
      mergeMap((countries:any[]) => countries = countries.sort((c1,c2) => (c1.name<c2.name)?-1:((c1.name>c2.name)?1:0))))*/;
      this.countryListDetails$ = this.store.select(
        getCountryListDetails
      )

    this.countriesIds$ = this.store.select(getCountriesIdsInApp);
  }

  onSubmit(country: Country) {
    this.store.dispatch(new CountriesAction.AddCountryAction(country));
  }
}
