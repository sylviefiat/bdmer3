
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
    <bc-result-rappel [analyseData]="analyseData$ | async" [locale]="locale$ | async"></bc-result-rappel>
    <bc-result-synthesis *ngIf="results$ | async" [results]="results$ | async" [analyseData]="analyseData$ | async" [locale]="locale$ | async"></bc-result-synthesis>
    <div class="loader" *ngIf="!(results$ | async)">
      <div class="lds-dual-ring"></div>
    </div>
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
  .loader {
    width: 100%;
    text-align:center;
  }
  .lds-dual-ring {      
      display: inline-block;
      width: 64px;
      height: 64px;
      z-index: 100000;
    }
    .lds-dual-ring:after {
      content: " ";
      display: block;
      width: 46px;
      height: 46px;
      margin: 1px;
      border-radius: 50%;
      border: 5px solid #fff;
      border-color: #000 transparent #000 transparent;
      animation: lds-dual-ring 1.2s linear infinite;
      z-index: 100000;
    }
    @keyframes lds-dual-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
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
    this.analyseData$.map(d => {
      console.log(d);
      if(!d){ 
        this.routerext.navigate(['/analyse']);
      }
    });
  }


}
