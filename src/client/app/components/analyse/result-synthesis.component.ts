
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as Turf from '@turf/turf';
import { MatCheckboxChange } from '@angular/material';
import { IAppState } from '../../modules/ngrx/index';
import { MapService } from '../../modules/core/services/index';
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
          [showZones]="showZones$ | async"
          (zoneEmitter)="dislayGraphZone($event)">
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
      </div>
      <div> 
        <h3>{{ 'GRAPH_PLATFORMS' | translate }}</h3>
        <bc-result-boxplot class="chart"
                  [chartsData]="results"
                  [species]="analyseData.usedSpecies"
                  [type]="typeShow$ | async">
                </bc-result-boxplot>
      </div>
      <div>
        <h3>{{ 'GRAPH_PER_ZONES' | translate }}</h3>
        <mat-tab-group class="primer" class="results" [selectedIndex]="selectedZone"> 
          <mat-tab *ngFor="let zone of sortedZoneList; let i=index"  label="{{(zone)?.properties.code}}">          
            <ng-template matTabContent>
              <div class="groupCharts">
                <bc-result-boxplot class="chart"
                  [chartsData]="results"
                  [species]="analyseData.usedSpecies"
                  [zone]="zone"
                  [type]="typeShow$ | async">
                </bc-result-boxplot>
              </div>
            </ng-template>
          </mat-tab>
        </mat-tab-group>
      </div>
  `,
    styles: [
        `
      :host {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content:center;
      }
      h2 {
        margin-left: 25px;
      } 
      .results {
        display:flex;
        width: 90vw;
        justify-content:center;
      }
      .resultZone {
        max-width: 100vw;
      }
      .groupCharts {
        display:flex;
        flex-direction:row;
        flex-wrap: wrap;
        padding-top:0.5em;
        padding-left:0.5em;
        padding-right:0.5em;
        width: 90vw;
      }
      .chart {
        display:flex;
        flex: 50%;
        flex-direction:column;
        flex-wrap: wrap;
        padding-right:0.3em;
      }
    .show {
      display: block;
    }
    .hide {
      display: none;
    }
    .noData {
      min-height:300px;
      background-color: white;
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
    selectedZone: number;
    sortedZoneList: Zone[];

    constructor() {

    }

    ngOnInit() {
      this.typeShow$=of('B');
      this.spShow$=of(this.results.resultPerSurvey[0].resultPerSpecies[0].codeSpecies);
      this.surveyShow$=of(this.results.resultPerSurvey[0].codeSurvey);
      this.currentresultSurvey$ = of(this.results.resultPerSurvey.filter(rs => rs.codeSurvey === this.results.resultPerSurvey[0].codeSurvey)[0]);
      this.showStations$=of(true);
      this.showZones$=of(false);
      this.selectedZone = 0;
      this.sortedZoneList = this.analyseData.usedZones.sort((z1,z2)=> z1.properties.code >= z2.properties.code? Number(1):Number(-1));
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

    getStationsZone(zone){
      let stations = [];
      for (let s of this.analyseData.usedStations) {
        if (MapService.booleanInPolygon(s, MapService.getPolygon(zone,{name:zone.properties.name}))) {
            stations.push(s);
        }
      }
      return stations;
    }

    selectTypeShow(ts: string){
      this.typeShow$ = of(ts);
    }

    selectSpShow(sps: string){
      this.spShow$ = of(sps);
    }

    selectSurveyShow(sus: string){
      this.surveyShow$ = of(sus);
      this.currentresultSurvey$ = of(this.results.resultPerSurvey.filter(rs => rs.codeSurvey === sus)[0]);
    }

    stationsLayerShow(show: MatCheckboxChange){
      this.showStations$ = of(show.checked);      
    }

    zonesLayerShow(show: MatCheckboxChange){
      this.showZones$ = of(show.checked);      
    }

    dislayGraphZone(codeZone: string){
      let selected = this.sortedZoneList.map(z=>z.properties.code).indexOf(codeZone);
      if(selected){
        this.selectedZone = selected;
      }
    }

}
