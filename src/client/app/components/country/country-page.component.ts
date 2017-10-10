import 'rxjs/add/operator/let';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import { PouchDBService } from "../../modules/core/services/pouchdb.service";

import { IAppState, getCountriesInApp } from '../../modules/ngrx/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { Country } from '../../modules/countries/models/country';

@Component({
  selector: 'bc-country-page',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <md-card>
      <md-card-title>Countries in BDMER</md-card-title>
    </md-card>
    <bc-country-preview-list [countries]="countries$ | async"></bc-country-preview-list>
    <md-card>
      <md-card-actions align="start">

        <button md-raised-button color="primary" (click)="newCountry()">
        New Country
        </button>
      </md-card-actions>
    </md-card>
  `,
  /**
   * Container components are permitted to have just enough styles
   * to bring the view together. If the number of styles grow,
   * consider breaking them out into presentational
   * components.
   */
  styles: [
    `
    md-card-title {
      display: flex;
      justify-content: center;
    }
  `,
  ],
})
export class CountryPageComponent implements OnInit {
  countries$: Observable<Country[]>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {    
    this.countries$ = this.store.let(getCountriesInApp);
    this.store.dispatch(new CountriesAction.LoadAction()); 
      //console.log(this.countries$) 
  }

  get pays() {
    return this.countries$.map(countries => {
      //console.log(countries);
      return this.countries$;
    })
    
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
