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
      <mat-card *ngIf="user.countryCode==='AA'">
      <mat-form-field>
      <mat-select  placeholder="Select country" [ngModel]="currentCountry" (change)="setCountry($event.value)">
          <mat-option *ngFor="let pays of countries" [value]="pays">{{ pays.name }}</mat-option>
      </mat-select>
      </mat-form-field>
      </mat-card>
  `,
  styles: [
    `
  `,
  ],
})
export class ManagementChooseComponent  {
  @Input() user: User;
  @Input() countries: Country[];
  @Input() currentCountry: Country | null;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {

  }


  setCountry(country: Country) {
    console.log(country);
    this.store.dispatch(new CountryAction.SelectAction(country._id));
    this.store.dispatch(new SiteAction.LoadAction());
  }
}