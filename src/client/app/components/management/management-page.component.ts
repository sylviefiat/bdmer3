
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
import { SiteAction } from '../../modules/datas/actions/index';
import { Country, User } from '../../modules/countries/models/country';


@Component({
  moduleId: module.id,
  selector: 'bc-data-page',
  template: `
    <mat-card>
      <mat-card-title>{{'MANAGE' | translate}}</mat-card-title>
    </mat-card>
    <bc-choose [user]="user$ | async" [countries]="countries$ | async" [currentCountry]="country$ | async"></bc-choose>
    <bc-data [user]="user$ | async" [country]="country$ | async"></bc-data>
  `,
  styles: [
    `
    mat-card-title {
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
    
    this.countries$ = this.store.let(getCountriesInApp);
    this.actionsSubscription = this.store.let(getAuthCountry)
      .filter((country: Country) => country && country.code !== 'AA')
      .map((country: Country) => new CountryAction.SelectAction(country._id))
      .subscribe(this.store);
  }

  ngOnInit() {
    this.store.dispatch(new CountriesAction.LoadAction());
    this.country$ = this.store.let(getSelectedCountry);
    this.user$ = this.store.let(getAuthUser);
  }

}
