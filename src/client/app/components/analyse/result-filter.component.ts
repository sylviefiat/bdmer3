
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild, EventEmitter, Output } from '@angular/core';

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-result-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="container">
    <div class="legend">
        <h3>{{'FILTER' | translate}}</h3>
        <h4>{{'LAYERS' | translate}}</h4>
        <mat-checkbox [checked]="showStations" (change)="showStationsEmitter.emit($event)">{{ 'STATIONS' | translate}}</mat-checkbox>
        <mat-checkbox [checked]="showZones" (change)="showZonesEmitter.emit($event)">{{ 'ZONES' | translate}}*</mat-checkbox>
        <p class="note">* {{'CLICK_ZONE' | translate}}</p>
        <h4 *ngIf="showBiom"> {{'TYPE' | translate}}</h4>
        <mat-select *ngIf="showBiom" [(ngModel)]="typeShow" (selectionChange)="this.typeShowEmitter.emit($event.value)">
          <mat-option value="B">{{'DISPLAY_BIOMASS' | translate}}</mat-option>
          <mat-option value="A">{{'DISPLAY_ABUNDANCE' | translate}}</mat-option>
        </mat-select>
        <div>
          <div *ngFor="let item of legend">
            <span class="legend-key" [style.backgroundColor]="item.color"></span>
            <span>{{item.value}} </span><span>{{getUnit()}}</span>
          </div>
        </div>
        <h4>{{'SPECIES' | translate}}</h4>
        <mat-select [(ngModel)]="spShow" (selectionChange)="this.spShowEmitter.emit($event.value)">
          <mat-option [value]="null">-</mat-option>
          <mat-option *ngFor="let sp of species" value="{{sp.code}}">{{sp.scientificName}}</mat-option>
        </mat-select>
        <h4>{{'SURVEYS' | translate}}</h4>
        <mat-select [(ngModel)]="surveyShow" (selectionChange)="this.surveyShowEmitter.emit($event.value)">
          <mat-option [value]="null">-</mat-option>
          <mat-option *ngFor="let sv of surveys" value="{{sv.code}}">{{sv.code}}</mat-option>
        </mat-select>
    </div>
  </div>
  `,
  styles: [
  `
    .container {
      display: flex;
      margin-left: 20px;
      margin-right: 20px;
    }
    .legend {
      padding-left: 10px;
      border: 1px solid black;
    }
    mat-radio-group{
      display: flex;
      flex-direction: column;
    }
    .note {
      color: grey;
      font-style: italic; 
      font-size: smaller;
    }
    .legend-key {
      display: inline-block;
      border-radius: 20%;
      width: 10px;
      height: 10px;
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
  legend = [{value:'0-1',color:'#FFEDA0'}, {value:'1-10',color:'#FED976'}, 
    {value:'10-20',color:'#FEB24C'},{value:'20-30',color:'#FD8D3C'}, 
    {value:'30-40',color:'#FC4E2A'}, {value:'40-50',color:'#E31A1C'}, 
    {value:'50-100',color:'#BD0026'}, {value:'100+',color:'#800026'}];
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
