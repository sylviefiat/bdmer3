import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';

import { User, Country } from '../../modules/countries/models/country';
import { IAppState, getCountryPageError, getSelectedCountry, getSelectedUser, getisAdmin } from '../../modules/ngrx/index';
import { CountryAction, CountriesAction } from '../../modules/countries/actions/index';

@Component({
  selector: 'bc-new-user-page',
  template: `
    <bc-new-user-form 
      [country]="country$ | async"
      [user]="user$ | async"
      [isAdmin]="isAdmin$ | async"
      (submitted)="onSubmit($event)"
      (back)="onReturn($event)"
      [errorMessage]="error$ | async">
    </bc-new-user-form>
  `,
})
export class NewUserPageComponent implements OnInit {
  countryActionsSubscription: Subscription;
  userActionsSubscription: Subscription;

  error$: Observable<string | null>;
  public country$: Observable<Country>;
  public user$: Observable<User>;
  public isAdmin$: Observable<boolean>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, public route: ActivatedRoute) {
    this.countryActionsSubscription = this.route.params.pipe(
      map(params => new CountryAction.SelectAction(params.idCountry)))
      .subscribe(store);
    this.userActionsSubscription = this.route.params.pipe(
      map(params => new CountryAction.SelectUserAction(params.idUser)))
      .subscribe(store);
  }

  ngOnInit() {
    this.store.dispatch(new CountriesAction.LoadAction());
    this.error$ = this.store.select(getCountryPageError);   
    this.country$ =this.store.select(getSelectedCountry);   
    this.user$ =this.store.select(getSelectedUser);
    this.isAdmin$ =this.store.select(getisAdmin);
    
  }

  ngOnDestroy() {
    this.countryActionsSubscription.unsubscribe();
    this.userActionsSubscription.unsubscribe();
  }

  onSubmit(user: User) {
    this.store.dispatch(new CountryAction.AddUserAction(user));
  }

  onReturn(countryCode: string){
    this.routerext.navigate(['countries/'+countryCode]);
  }
}