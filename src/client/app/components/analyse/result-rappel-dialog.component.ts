
import { Component, Inject, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { LngLatBounds, LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';
import { IAnalyseState } from '../../modules/analyse/states/index';
import * as Turf from '@turf/turf';
import { MapService } from '../../modules/core/services/index';
import { DialogData } from './result-rappel.component';


@Component({
  selector: 'bc-result-rappel-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `    
    <div mat-dialog-title>
    <h2>{{'RECAPITULATIF' | translate}}</h2>
      <p> {{ 'NUMBER_PLATFORMS_SELECT' | translate }}: {{ data.analyseData.usedPlatforms.length }}</p>
      <p> {{ 'NUMBER_SURVEYS_SELECT' | translate }}: {{ data.analyseData.usedSurveys.length }}</p>   
      <mat-form-field>
        <mat-select  placeholder="{{'SELECT_SURVEY' | translate}}" (selectionChange)="selectSurvey($event.value)">
          <mat-option [value]="null">{{ 'ALL_SURVEYS' | translate}}</mat-option>
          <mat-option *ngFor="let survey of data.analyseData.usedSurveys" [value]="survey">{{ survey.code }}</mat-option>
        </mat-select>
      </mat-form-field>   
    </div>
    <div mat-dialog-content>
      <div *ngIf="survey">
          <p><label>{{ 'SURVEY_DATES' | translate}}:</label> {{ survey.dateStart  | date:localeDate }}, {{ survey.dateEnd  | date:localeDate }}</p>
          <p><label>{{ 'PARTICIPANTS' | translate}}:</label> {{survey.participants}}</p>
          <p class="subtitle">{{ 'NUMBER_SP_SELECT' | translate}}: {{spInSurveys[survey.code].length}}</p>
          <mat-tab-group class="spDisplay">
            <mat-tab *ngFor="let sp of spInSurveys[survey.code]" label="{{sp.scientificName}}"> 
              <div class="spimage"><img [src]="sp.picture"/></div>           
              <div>
                <p><label>{{ 'SP' | translate }}:</label> {{ sp.scientificName }}</p>
                <p><label>{{ 'SPECIES_VERNACULAR_NAME' | translate }}:</label> 
                  <span *ngFor="let name of sp.names;let i=index">{{(i>0)?',':''}} {{name.name}} ({{name.lang}})</span>
                </p>
                <p><label>{{ 'DISTRIBUTION' | translate }}:</label> {{ sp.distribution }}</p>
                <p><label>{{ 'HABITAT_PREF' | translate }}:</label> {{ sp.habitatPreference }}</p>
                <p><label>{{ 'LEGAL_DIM_COUNTRIES' | translate }}:</label> 
                  <span *ngFor="let ld of sp.legalDimensions;let i=index">{{(i>0)?',':''}} {{ld.longMin}}/{{ld.longMax}}mm ({{ld.codeCountry}})</span>
                </p>
              </div>
            </mat-tab>
          </mat-tab-group>
      </div>  
      <div class="container">
        <mgl-map *ngIf="!loading"
          [style]="'mapbox://styles/mapbox/satellite-v9'"
          [fitBounds]="bounds"
          [fitBoundsOptions]="{
            padding: boundsPadding,
            maxZoom: zoomMaxMap
          }"
          (load) = "setMap($event)">
          <ng-container *ngIf="layerStations$ | async">
            <mgl-geojson-source
              id="layerStations"
              [data]="layerStations$ | async">
              <mgl-layer
                  id="stationId"
                  type="circle"
                  source="layerStations"
                  [paint]="{
                    'circle-color': '#FF0000',
                    'circle-radius':2
                  }">
              </mgl-layer>
            </mgl-geojson-source>
          </ng-container>
          <ng-container *ngIf="layerZones$ | async">
            <mgl-geojson-source
              id="layerZones"
              [data]="layerZones$ | async">
              <mgl-layer
                id="zonesid"
                type="fill"
                source="layerZones"
                [paint]="{
                  'fill-color':'#FFEDA0',
                  'fill-opacity': 0.3,
                  'fill-outline-color': '#FFF'
                }">
              </mgl-layer>
            </mgl-geojson-source>
          </ng-container>
        </mgl-map>
      </div>
    </div>
  `,
  styles: [
    `
    h2 {
      margin-left: 25px;
    }
    .subtitle, .displayer {
      margin-left: 30px;
    }   
    .displayer {
      color: darkgrey;
      font-style: italic;
      cursor: pointer
    }
    mat-tab-group.primer {
      margin: 25px 72px;
      background-color: white;
    }
    p, .spDisplay {
      margin-left: 10px;
    }
    .spDisplay {
      font-size: smaller;
    }
    label {
      color:darkgrey;
    }
    .spimage {
      float:left;
      margin-right:50px; 
    }
    .spimage img {      
      max-height:200px;
    }
    mgl-map {
      width: 650px;
      height: 500px;
      border: 1px solid black;
    }
  `]
})
export class ResultRappelDialogComponent implements OnInit {
  survey: Survey;
  spInSurveys: Species[][];
  znInSurveys: Zone[][];
  localeDate: string;
  layerStations$: Observable<Turf.FeatureCollection>;
  layerZones$: Observable<Turf.FeatureCollection>;
  bounds:LngLatBounds;
  boundsPadding: number = 100;
  zoomMaxMap = 10;
  map: any;

  constructor(
    public dialogRef: MatDialogRef<ResultRappelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.survey = null;
    this.setLocaleDate();
    this.spInSurveys=[];
    this.znInSurveys=[];
    this.displayOnMap(this.data.analyseData.usedZones,this.data.analyseData.usedStations);
  }

  setMap(event) {
    this.map = event;
    if (this.bounds) {
      this.map.fitBounds(this.bounds, { padding: 10 });
    }
  }

  selectSurvey(survey) {
    this.survey = survey;
    if(survey){
      this.getSpInSurvey();
      this.getZnInSurvey();
      this.displayOnMap(this.znInSurveys[this.survey.code],this.data.analyseData.usedStations.filter(st=>this.survey.counts.map(s=>s.codeStation).indexOf(st.properties.code)>=0));
    }
  }

  getSpInSurvey() {
    if(!this.spInSurveys[this.survey.code]){
      this.spInSurveys[this.survey.code] = [];
      for (let c of this.survey.counts) {
        let data = c.mesures && c.mesures.length > 0 ? c.mesures : c.quantities;
        for (let m of data) {
          if (this.spInSurveys[this.survey.code].map(sp => sp.code).indexOf(m.codeSpecies) < 0)
            this.spInSurveys[this.survey.code]=[...this.spInSurveys[this.survey.code],...this.data.analyseData.usedSpecies.filter(sp => sp.code===m.codeSpecies)];
        }
      }
    }
    return this.spInSurveys[this.survey.code];
  }

  getZnInSurvey() {
    if(!this.znInSurveys[this.survey.code]){
      this.znInSurveys[this.survey.code] = [];
      for(let zone of this.data.analyseData.usedZones.filter(z => z.codePlatform == this.survey.codePlatform)){
        for(let cs of this.survey.counts.map(count => count.codeStation)){
          if(this.znInSurveys[this.survey.code].map(zn => zn.properties.code).indexOf(zone.properties.code)<0){
            let station = this.data.analyseData.usedStations.filter(st => st.properties.code===cs)[0];
            if(station && MapService.booleanInPolygon(station, MapService.getPolygon(zone,{}))){
              this.znInSurveys[this.survey.code]=[...this.znInSurveys[this.survey.code],zone];
            }
          }
        }
      }
    }
  }

  displayOnMap(zones:Zone[],stations:Station[]){
    let featureCollection = Turf.featureCollection(stations.map(st => MapService.getFeature(st,{code:st.properties.code})));
    this.layerStations$ = of(featureCollection);
    // zones
    let fc2 = Turf.featureCollection(
      zones
        .map(zone => MapService.getPolygon(zone,{code: zone.properties.code}))
        .filter(polygon => polygon !== null)
    );
    this.layerZones$ = of(fc2);
    if(zones.length > 0){      
      this.bounds = MapService.zoomToZones(fc2);
      if(this.bounds && this.map){
        this.map.fitBounds(this.bounds, { padding: 10 });
      }
    }
  }

  setLocaleDate(){
    switch (this.data.locale) {
        case "fr":
          this.localeDate = 'dd-MM-yyyy';
          break;
        case "en":
        default:
          this.localeDate = 'MM-dd-yyyy';
      }
  }
}

