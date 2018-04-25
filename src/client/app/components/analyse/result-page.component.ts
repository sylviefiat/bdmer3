import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState, getAnalyseResult } from '../../modules/ngrx/index';
import { Platform, Zone, Survey, Transect, Species } from '../../modules/datas/models/index';
import { Method, Results } from '../../modules/analyse/models/index';
import { Country } from '../../modules/countries/models/country';
import { CountriesAction, CountryAction } from '../../modules/countries/actions/index';
import { PlatformAction, SpeciesAction } from '../../modules/datas/actions/index';
import { AnalyseAction } from '../../modules/analyse/actions/index';


@Component({
  selector: 'bc-result-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
    is ok !
    </div>
  `,
})
export class ResultPageComponent implements OnInit {
  results$: Observable<Results[]>;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    
  }

  ngOnInit() {
    this.results$ = this.store.let(getAnalyseResult);
  }


}
