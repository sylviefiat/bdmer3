
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatCheckboxChange } from '@angular/material';
import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species } from '../../modules/datas/models/index';
import { Results, Data, ResultSurvey } from '../../modules/analyse/models/index';

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
          [surveyShow]="surveyShow$ | async"
          [showStations]="showStations$ | async"
          [showZones]="showZones$ | async">
        </bc-result-map>

        <bc-result-filter 
          [species]="analyseData.usedSpecies" 
          [surveys]="analyseData.usedSurveys"
          [typeShow]="typeShow$ | async" 
          [spShow]="spShow$ | async" 
          [surveyShow]="surveyShow$ | async"
          [showStations]="showStations$ | async"
          [showZones]="showZones$ | async"
          (typeShowEmitter)="selectTypeShow($event)"
          (spShowEmitter)="selectSpShow($event)"
          (surveyShowEmitter)="selectSurveyShow($event)"
          (showStationsEmitter)="stationsLayerShow($event)"
          (showZonesEmitter)="zonesLayerShow($event)">
        </bc-result-filter>

        <div class="groupCharts">
          <h3>{{typeShow$ | async}}</h3>
          <div class="chart">
            <bc-result-boxplot 
              [resultSurveys]="results.resultPerSurvey"
              [usedSurveys]="analyseData.usedSurveys"
              [years]="analyseData.usedYears"
              [species]="analyseData.usedSpecies"
              [type]="typeShow$ | async">
            </bc-result-boxplot>
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
    typeShow$ : Observable<string>;
    spShow$: Observable<string>;
    surveyShow$: Observable<string>;
    showStations$: Observable<boolean>;
    showZones$: Observable<boolean>;
    currentresultSurvey$: Observable<ResultSurvey>;

    constructor() {

    }

    ngOnInit() {
      this.typeShow$=of('B');
      this.spShow$=of(this.results.resultPerSurvey[0].resultPerSpecies[0].codeSpecies);
      this.surveyShow$=of(this.results.resultPerSurvey[0].codeSurvey);
      this.currentresultSurvey$ = of(this.results.resultPerSurvey.filter(rs => rs.codeSurvey === this.results.resultPerSurvey[0].codeSurvey)[0]);
      this.showStations$=of(true);
      this.showZones$=of(false);
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
      console.log(sus);
      console.log(this.results.resultPerSurvey.filter(rs => rs.codeSurvey === sus)[0]);
      this.currentresultSurvey$ = of(this.results.resultPerSurvey.filter(rs => rs.codeSurvey === sus)[0]);
    }

    stationsLayerShow(show: MatCheckboxChange){
      console.log(show);
      this.showStations$ = of(show.checked);      
    }

    zonesLayerShow(show: MatCheckboxChange){
      console.log(show);
      this.showZones$ = of(show.checked);      
    }

}
