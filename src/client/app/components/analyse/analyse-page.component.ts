import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState, getCountriesInApp } from '../../modules/ngrx/index';
import { Site, Zone, Campaign } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';
import { CountriesAction } from '../../modules/countries/actions/index';


@Component({
  selector: 'bc-analyse-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-analyse 
      [countries]="countries$ | async"
      [msg]="msg$ | async">
    </bc-analyse>
  `,
})
export class AnalysePageComponent implements OnInit {
  countries$: Observable<Country[]>;
  isAdmin$: Observable<boolean>;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    
  }

  ngOnInit() {
    this.countries$ = this.store.let(getCountriesInApp);
    this.store.dispatch(new CountriesAction.LoadAction());
  }

}
