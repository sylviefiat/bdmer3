import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getAllCountriesInApp, getPlatformTypesList } from '../../modules/ngrx/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { Country } from '../../modules/countries/models/country';

@Component({
  selector: 'bc-country-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>{{ 'TITLE_COUNTRIES' | translate}}</mat-card-title>
      <button mat-raised-button color="primary" (click)="newCountry()">
        {{ 'NEW_COUNTRY' | translate}}
      </button>
    </mat-card>
    <bc-country-preview-list [countries]="countries$ | async" [platformTypeList]="platformTypeList$ | async"></bc-country-preview-list>
    
  `,
  styles: [
    `
    mat-card {
      text-align: center;
    }
    mat-card-title {      
      display: flex;
      justify-content: center;
    }
  `,
  ],
})
export class CountryPageComponent implements OnInit {
  countries$: Observable<Country[]>;
  platformTypeList$: Observable<any[]>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {    
    this.countries$ = this.store.select(getAllCountriesInApp);
    this.store.dispatch(new CountriesAction.LoadAction()); 
    this.platformTypeList$ = this.store.select(getPlatformTypesList);
  }

  newCountry() {
    this.routerext.navigate(['/newcountry'], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }
}
