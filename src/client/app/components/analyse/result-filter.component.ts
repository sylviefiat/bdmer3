
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild, EventEmitter, Output } from '@angular/core';

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-result-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <mat-card class="container">
    <mat-card-title-group>
        <mat-card-title>{{'FILTER' | translate}}</mat-card-title>        
    </mat-card-title-group>
        <mat-card-content>
          <mat-card-subtitle>{{'LAYERS' | translate}}</mat-card-subtitle>
          <mat-checkbox [checked]="showStations" (change)="showStationsEmitter.emit($event)">{{ 'STATIONS' | translate}}</mat-checkbox>
          <mat-checkbox [checked]="showZones" (change)="showZonesEmitter.emit($event)">{{ 'ZONES' | translate}}*</mat-checkbox>
          <p class="note">* {{'CLICK_ZONE' | translate}}</p>
        </mat-card-content>
        <mat-card-content>
          <mat-card-subtitle *ngIf="showBiom"> {{'TYPE' | translate}}</mat-card-subtitle>
          <mat-form-field>
            <mat-select *ngIf="showBiom" [(ngModel)]="typeShow" (selectionChange)="this.typeShowEmitter.emit($event.value)">
              <mat-option value="B">{{'DISPLAY_BIOMASS' | translate}}</mat-option>
              <mat-option value="A">{{'DISPLAY_ABUNDANCE' | translate}}</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card-content>
        <mat-card-content class="legend">
          <div class="stationLegend" *ngIf="showStations">
            <mat-card-subtitle> {{'STATIONS' | translate}}</mat-card-subtitle>
            <div *ngFor="let item of legend">
              <span class="legend-circle" [style.width]="item.size+'px'" [style.height]="item.size+'px'"></span>              
              <span>{{item.value}} </span><span>{{getUnit()}}</span>
            </div>
          </div>
          <div class="zoneLegend" *ngIf="showZones">
          <mat-card-subtitle> {{'ZONES' | translate}}</mat-card-subtitle>
            <div *ngFor="let item of legend">
              <span class="legend-key" [style.backgroundColor]="item.color"></span>
              <span>{{item.value}} </span><span>{{getUnit()}}</span>
            </div>
          </div>
        </mat-card-content>
        <mat-card-content>
          <mat-card-subtitle>{{'SPECIES' | translate}}</mat-card-subtitle>
          <mat-form-field>
            <mat-select [(ngModel)]="spShow" (selectionChange)="this.spShowEmitter.emit($event.value)">
              <mat-option [value]="null">-</mat-option>
              <mat-option *ngFor="let sp of species" value="{{sp.code}}">{{sp.scientificName}}</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card-content>
        <mat-card-content>
          <mat-card-subtitle>{{'SURVEYS' | translate}}</mat-card-subtitle>
          <mat-form-field>
            <mat-select [(ngModel)]="surveyShow" (selectionChange)="this.surveyShowEmitter.emit($event.value)">
              <mat-option [value]="null">-</mat-option>
              <mat-option *ngFor="let sv of surveys" value="{{sv.code}}">{{sv.code}}</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card-content>
  </mat-card>
  `,
  styles: [
  `
    mat-card {
      display:flex;
      flex-direction:column;
    }
    .mat-card-subtitle {
      display: inline !important;
      margin-right: 10px;
    }
    .mat-checkbox {
      padding-right: 10px;
    }
    .note {
      color: grey;
      font-style: italic; 
      font-size: smaller;
    }
    .legend {
      display:flex;
      flex-direction:row;
      justify-content: space-around;
    }
    .stationLegend, .zoneLegend {
      display:flex;
      flex-direction:column;
    }
    .legend-key {
      display: inline-block;
      border-radius: 20%;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
    .legend-circle {
      display: inline-block;
      border-radius: 50%;
      border: solid 1px black;
      background-color: white;
      margin-right: 5px;
    }
  `]
})
export class ResultFilterComponent implements OnInit/*, AfterViewInit*/ {
  @Input() species: Species[];
  @Input() surveys: Survey[];
  @Input() showBiom: boolean;
  @Input() typeShow : string;
  @Input() spShow: string;
  @Input() surveyShow: string;
  @Input() showStations: boolean;
  @Input() showZones: boolean;
  @Output() typeShowEmitter= new EventEmitter<string>();
  @Output() spShowEmitter = new EventEmitter<string>();
  @Output() surveyShowEmitter = new EventEmitter<string>();
  @Output() showStationsEmitter = new EventEmitter<string>();
  @Output() showZonesEmitter = new EventEmitter<string>();
  legend = [{value:'0-1',color:'#FFEDA0',size:4}, {value:'1-10',color:'#FED976',size:6}, 
    {value:'10-20',color:'#FEB24C',size:8},{value:'20-30',color:'#FD8D3C',size:10}, 
    {value:'30-40',color:'#FC4E2A',size:12}, {value:'40-50',color:'#E31A1C',size:14}, 
    {value:'50-100',color:'#BD0026',size:16}, {value:'100+',color:'#800026',size:18}];
  units = ['kg/ha', 'ind./ha'];

  constructor() {

  }

  ngOnInit(){  
    this.surveys = this.surveys.sort((s1,s2)=>s1.code >= s2.code ? Number(1):Number(-1));
  }

  setShowSp(spCode: any){
    this.spShow = spCode.value;
    this.spShowEmitter.emit(this.spShow);
  }

  setShowSurvey(svCode: any){
    this.surveyShow = svCode.value;
    this.surveyShowEmitter.emit(this.surveyShow);
  }

  getUnit(){
    return this.units[this.typeShow==='B'?0:1];
  }


}
