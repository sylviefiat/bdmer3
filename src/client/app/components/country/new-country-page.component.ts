import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouterExtensions, Config } from '../../modules/core/index';

import { Country } from '../../modules/countries/models/country';
import { IAppState, getCountryPageError, getCountryList, getCountryListDetails, getCountriesIdsInApp, getPlatformTypesList} from '../../modules/ngrx/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    selector: 'bc-new-country-page',
    template: `
    <bc-new-country-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [countryList]="countryList$ | async"
      [countryListDetails]="countryListDetails$ | async"
      [platformTypeList]="platformTypeList$ | async"
      [countriesIds]="countriesIds$ | async">
    </bc-new-country-form>
  `,
})
export class NewCountryPageComponent implements OnInit {
    error$: Observable<string | null>;
    countryList$: Observable<any[]>;
    countryListDetails$: Observable<any[]>;
    platformTypeList$: Observable<any[]>;
    countriesIds$: Observable<any[]>;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions) { }

    ngOnInit() {
        this.store.dispatch(new CountriesAction.InitAction());
        this.store.dispatch(new CountriesAction.LoadAction());
        this.error$ = this.store.select(getCountryPageError);
        this.countryList$ = this.store.select(
            getCountryList
        );
        this.countryListDetails$ = this.store.select(
            getCountryListDetails
        );
        this.platformTypeList$ = this.store.select(
            getPlatformTypesList
        );

        this.countriesIds$ = this.store.select(getCountriesIdsInApp);
    }

    onSubmit(country: Country) {
        this.store.dispatch(new CountriesAction.AddCountryAction(country));
    }
}
