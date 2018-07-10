
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IAppState, getAnalyseData, getAnalyseResult, getLangues, isAnalysing, isAnalysed } from '../../modules/ngrx/index';
import { Platform, Zone, Survey, Station, Species } from '../../modules/datas/models/index';
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
    <div *ngIf="(analysing$ | async)||loading">Analyse en cours...</div>
    <bc-result-rappel *ngIf="analysed$ | async" [analyseData]="analyseData$ | async" [locale]="locale$ | async"></bc-result-rappel>
    <bc-result-synthesis *ngIf="analysed$ | async" [results]="results$ | async" [analyseData]="analyseData$ | async" [locale]="locale$ | async"></bc-result-synthesis>
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
export class ResultPageComponent implements OnInit, AfterViewInit {
  analyseData$: Observable<Data>;
  results$: Observable<Results>;
  locale$: Observable<string>;
  analysing$: Observable<boolean>;
  analysed$: Observable<boolean>;
  loading: boolean;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {

  }

  ngOnInit() {
    this.loading=true;
    this.analysing$ = this.store.select(isAnalysing);
    this.analysed$ = this.store.select(isAnalysed);
    this.analyseData$ = this.store.select(getAnalyseData);
    this.results$ = this.store.select(getAnalyseResult);
    this.locale$ = this.store.select(getLangues);
  }

  ngAfterViewInit(){
    this.loading=false;
  }


}
