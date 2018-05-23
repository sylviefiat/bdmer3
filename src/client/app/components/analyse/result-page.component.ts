import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState, getAnalyseData, getAnalyseResult, getLangues } from '../../modules/ngrx/index';
import { Platform, Zone, Survey, Transect, Species } from '../../modules/datas/models/index';
import { Method, Results, Data } from '../../modules/analyse/models/index';
import { IAnalyseState } from '../../modules/analyse/states/index';
import { Country } from '../../modules/countries/models/country';
import { CountriesAction, CountryAction } from '../../modules/countries/actions/index';
import { PlatformAction, SpeciesAction } from '../../modules/datas/actions/index';
import { AnalyseAction } from '../../modules/analyse/actions/index';


@Component({
  selector: 'bc-result-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>{{'RESULT_TITLE' | translate}}</mat-card-title>
    </mat-card>
    <bc-result-rappel [analyseData]="analyseData$ | async" [locale]="locale$ | async"></bc-result-rappel>
    <bc-result-synthesis [results]="results$ | async" [data]="analyseData$ | async" [locale]="locale$ | async"></bc-result-synthesis>
  `,
  styles: [
    `
    mat-card-title, mat-card-content {
    display: flex;
    justify-content: center;
  }

  .main {
    margin: 72px 0;
  }
    `]
})
export class ResultPageComponent implements OnInit {
  analyseData$: Observable<Data>;
  results$: Observable<Results>;
  locale$: Observable<string>;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {

  }

  ngOnInit() {
    this.analyseData$ = this.store.let(getAnalyseData);
    this.results$ = this.store.let(getAnalyseResult);
    this.locale$ = this.store.let(getLangues);
  }


}
