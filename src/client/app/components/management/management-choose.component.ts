import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { FormGroup } from '@angular/forms'
import { RouterExtensions, Config } from '../../modules/core/index';

// app
import { Country, User } from '../../modules/countries/models/country';
import { CountryAction } from '../../modules/countries/actions/index';
import { SiteAction } from '../../modules/datas/actions/index';
import { IAppState } from '../../modules/ngrx/index';

@Component({
  moduleId: module.id,
  selector: 'bc-choose',
  template: `
      <md-card *ngIf="user.countryCode==='AA'">
      <md-select  placeholder="Select country" (change)="setCountry($event.value)">
          <md-option *ngFor="let pays of countries" [value]="pays">{{ pays.name }}</md-option>
      </md-select>
      </md-card>
  `,
  styles: [
    `
  `,
  ],
})
export class ManagementChooseComponent  {
  @Input() user: User;
  @Input() countries: Country[];

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {

  }


  setCountry(country: Country) {
    console.log(country);
    this.store.dispatch(new CountryAction.SelectAction(country._id));
    this.store.dispatch(new SiteAction.LoadAction());
  }
}