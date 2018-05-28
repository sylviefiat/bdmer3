
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species } from '../../modules/datas/models/index';
import { Results, Data } from '../../modules/analyse/models/index';

@Component({
    selector: 'bc-result-synthesis',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
      <h2>{{ results.name }}</h2>
      <div class="results">

        <bc-result-map 
          [results]="results" 
          [analyseData]="analyseData"
          [typeShow]="typeShow$ | async" 
          [spShow]="spShow$ | async" 
          [surveyShow]="surveyShow$ | async">
        </bc-result-map>

        <bc-result-filter 
          [species]="analyseData.usedSpecies" 
          [surveys]="analyseData.usedSurveys"
          [typeShow]="typeShow$ | async" 
          [spShow]="spShow$ | async" 
          [surveyShow]="surveyShow$ | async"
          (typeShowEmitter)="selectTypeShow($event)"
          (spShowEmitter)="selectSpShow($event)"
          (surveyShowEmitter)="selectSurveyShow($event)">
        </bc-result-filter>

        <div class="groupCharts">
          <h3>{{surveyShow$ | async}}</h3>
          <div class="chart">
            <bc-result-chart 
              [resultSurveys]="results.resultPerSurvey" 
              [surveyShow$]="surveyShow$" 
              [chartType]="'CandlestickChart'" 
              [type$]="typeShow$">
            </bc-result-chart>
            <bc-result-chart 
              [resultSurveys]="results.resultPerSurvey" 
              [surveyShow$]="surveyShow$" 
              [chartType]="'PieChart'" 
              [type$]="typeShow$">
            </bc-result-chart>
          </div>
        </div>
      </div>
  `,
    styles: [
        `
      h2 {
        margin-left: 25px;
      } 
      .results, .chart {
        display:flex;
        flex-direction:row;
      }
      .groupCharts {
        display:flex;
        flex-direction:column;
        flex:1;
      }
  `]
})
export class ResultSynthesisComponent implements OnInit {
    @Input() results: Results;
    @Input() analyseData: Data;
    @Input() locale: string;
    @Input() typeShow$ : Observable<string>;
    @Input() spShow$: Observable<string>;
    @Input() surveyShow$: Observable<string>;

    constructor() {

    }

    ngOnInit() {
      this.typeShow$=of('B');
      this.spShow$=of(this.results.resultPerSurvey[0].resultPerSpecies[0].codeSpecies);
      this.surveyShow$=of(this.results.resultPerSurvey[0].codeSurvey);
    }

    get localDate() {
        switch (this.locale) {
            case "fr":
                return 'dd-MM-yyyy';
            case "en":
            default:
                return 'MM-dd-yyyy';
        }
    }

    selectTypeShow(ts: string){
      this.typeShow$ = of(ts);
    }

    selectSpShow(sps: string){
      this.spShow$ = of(sps);
    }

    selectSurveyShow(sus: string){
      this.surveyShow$ = of(sus);
    }


}
