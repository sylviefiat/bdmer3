import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

import { User, Country } from '../../modules/countries/models/country';
import { IAppState, getCountryPageError, getSelectedCountry } from '../../modules/ngrx/index';
import { CountryAction, CountriesAction } from '../../modules/countries/actions/index';

@Component({
  selector: 'bc-new-user-page',
  template: `
    <bc-new-user-form [country]="country$ | async"
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async">
    </bc-new-user-form>
  `,
})
export class NewUserPageComponent implements OnInit {
  actionsSubscription: Subscription;

  error$: Observable<string | null>;
  public country$: Observable<Country>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, public route: ActivatedRoute) {
    this.actionsSubscription = this.route.params
      .map(params => new CountryAction.SelectAction(params.id))
      .subscribe(store);
  }

  ngOnInit() {
    this.store.dispatch(new CountriesAction.LoadAction());
    this.error$ = this.store.let(getCountryPageError);   
    this.country$ =this.store.let(getSelectedCountry); 
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

  onSubmit(user: User) {
    console.log(user);
    this.store.dispatch(new CountryAction.AddUserAction(user));
  }
}