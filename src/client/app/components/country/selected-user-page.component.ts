import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getSelectedCountry } from '../../modules/ngrx/index';
import { CountryAction } from '../../modules/countries/actions/index';
import { User } from '../../modules/countries/models/country';

@Component({
  selector: 'bc-selected-user-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-user-detail
      [user]="user$ | async"
      (removeuser)="removeFromCountries($event)">
    </bc-user-detail>
  `,
})
export class SelectedUserPageComponent implements OnInit {
  user$: Observable<User>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
    console.log("inituser");
    this.user$ = this.store.let(getSelectedCountry);    
  }

  removeFromCountry(user: User) {
    this.store.dispatch(new CountryAction.RemoveUserAction(user));
  }
}
