
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
      <bc-result-stock *ngIf="analyseData.usedCountry.platformType==1"
          [results]="results"
          [analyseData]="analyseData"
          [showBiom]="showBiom">
      </bc-result-stock>
      <div class="results">        

        <bc-result-map 
          [results]="results" 
          [analyseData]="analyseData"
          [showBiom]="showBiom"
          [typeShow]="typeShow$ | async"
          [spShow]="spShow$ | async" 
          [surveyShow]="surveyShow$ | async"
          [showStations]="showStations$ | async"
          [showZones]="showZones$ | async"
          [showZonesNoRatio]="showZonesNoRatio$ | async"
          (zoneEmitter)="selectZone($event)">
        </bc-result-map>

        <bc-result-filter 
          [species]="analyseData.usedSpecies" 
          [surveys]="analyseData.usedSurveys"
          [showBiom]="showBiom"
          [typeShow]="typeShow$ | async" 
          [spShow]="spShow$ | async" 
          [surveyShow]="surveyShow$ | async"
          [showStations]="showStations$ | async"
          [showZones]="showZones$ | async"
          [showZonesNoRatio]="showZonesNoRatio$ | async"
          [platformType]="analyseData.usedCountry.platformType"
          (typeShowEmitter)="selectTypeShow($event)"
          (spShowEmitter)="selectSpShow($event)"
          (surveyShowEmitter)="selectSurveyShow($event)"
          (showStationsEmitter)="stationsLayerShow($event)"
          (showZonesEmitter)="zonesLayerShow($event)"
          (showZoneNoEmitter)="zonesLayerNoRatioShow($event)">
        </bc-result-filter>
      </div>
      <div class="charts" *ngIf="analyseData.usedCountry.platformType==0"> 
        <mat-card>
          <mat-card-title-group>
            <mat-card-title>{{ 'GRAPH_PLATFORMS' | translate }}</mat-card-title>
          </mat-card-title-group>
          <bc-result-boxplot class="chart"
            [chartsData]="results"
            [species]="analyseData.usedSpecies"
            [type]="typeShow$ | async">
          </bc-result-boxplot>
        </mat-card>
        <mat-card>
          <mat-card-title-group>
            <mat-card-title>{{ 'GRAPH_PER_ZONES' | translate }}</mat-card-title>
            <mat-card-subtitle>
              <mat-form-field>
                <mat-select placeholder="{{'SELECT_ZONE' | translate}}" [value]="(selectedZone$ | async)" (selectionChange)="selectZone($event.value)">
                  <mat-option *ngFor="let zone of sortedZoneList" value="{{zone.properties.code}}" >{{zone.properties.code}}</mat-option> 
                </mat-select>
              </mat-form-field>
            </mat-card-subtitle>
          </mat-card-title-group>
          <mat-card-content *ngIf="selectedZone$ | async">
                <bc-result-boxplot class="chart"
                  [chartsData]="results"
                  [species]="analyseData.usedSpecies"
                  [codeZone]="selectedZone$ | async"
                  [type]="typeShow$ | async">
                </bc-result-boxplot>
          </mat-card-content>
        </mat-card>
      </div>
  `,
    styles: [
        `
      :host {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content:center;
      }
      h2 {
        margin-left: 25px;
      } 
      .results {
        display:flex;
        justify-content:center;
        margin-bottom:10px;
      }
      .charts {
        display:flex;
        justify-content:center;
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
    showZonesNoRatio$: Observable<boolean>;
    currentresultSurvey$: Observable<ResultSurvey>;
    selectedZone$: Observable<string>;
    sortedZoneList: Zone[];
    showBiom: boolean;

    constructor() {

    }

    ngOnInit() {
      this.typeShow$=of('A');
      this.spShow$=of(this.analyseData.usedSpecies[0].code);
      this.surveyShow$=of(this.analyseData.usedSurveys[0].code);
      this.currentresultSurvey$ = of(this.results.resultPerSurvey.filter(rs => rs.codeSurvey === this.analyseData.usedSurveys[0].code)[0]);
      this.showStations$=of(true);
      this.showZones$=of(true);
      this.showBiom = this.analyseData.usedMethod.method !== 'NONE';
      this.sortedZoneList = this.analyseData.usedZones.sort((z1,z2)=> this.customSort(z1.properties.code,z2.properties.code));
    }

    customSort(a:string, b:string) {
      return (Number(a.match(/(\d+)/g)[0]) - Number((b.match(/(\d+)/g)[0])));
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

    zonesLayerNoRatioShow(show: MatCheckboxChange){
      this.showZonesNoRatio$ = of(show.checked);      
    }

    selectZone(codeZone: string){
      this.selectedZone$ = of(codeZone);
    }

}
