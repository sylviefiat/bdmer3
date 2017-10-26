
// libs
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Subscription } from 'rxjs/Subscription';

// app
import { IAppState, getCountriesInApp, getAuthCountry, getAuthUser, getSelectedCountry } from '../../modules/ngrx/index';
import { CountryAction, CountriesAction } from '../../modules/countries/actions/index';
import { Country, User } from '../../modules/countries/models/country';


@Component({
  moduleId: module.id,
  selector: 'bc-data-page',
  template: `
    <md-card>
      <md-card-title>Data management</md-card-title>
    </md-card>
    <bc-choose [user]="user$ | async" [countries]="countries$ | async"></bc-choose>
    <bc-data [country]="country$ | async"></bc-data>
  `,
  styles: [
    `
    md-card-title {
      display: flex;
      justify-content: center;
    }
  `,
  ],
})
export class ManagementPageComponent implements OnInit  {
  actionsSubscription: Subscription;

  countries$: Observable<Country[]>;
  country$: Observable<Country>;
  user$: Observable<User>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {
    
  }

  ngOnInit() {
    this.store.dispatch(new CountriesAction.LoadAction());
    this.countries$ = this.store.let(getCountriesInApp);
    this.actionsSubscription = this.store.let(getAuthCountry)
      .map((country: Country) => new CountryAction.SelectAction(country._id))
      .subscribe(this.store);
    this.country$ = this.store.let(getSelectedCountry);
    this.user$ = this.store.let(getAuthUser);
  }

}
