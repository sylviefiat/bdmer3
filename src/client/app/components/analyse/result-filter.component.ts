
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
        <h4>{{'TYPE' | translate}}</h4>
        <mat-radio-group (change)="changeDisplay($event)">
          <mat-radio-button value="B" [checked]="typeShow==='B'">{{'DISPLAY_BIOMASS' | translate}}</mat-radio-button>
          <mat-radio-button value="A" [checked]="typeShow==='A'">{{'DISPLAY_ABUNDANCE' | translate}}</mat-radio-button>
        </mat-radio-group>
        <div>
          <div *ngFor="let item of legend">
            <span class="legend-key" [style.backgroundColor]="item.color"></span>
            <span>{{item.value}} </span><span>{{getUnit()}}</span>
          </div>
        </div>
        <h4>{{'SPECIES' | translate}}</h4>
        <mat-radio-group (change)="setShowSp($event)">
          <mat-radio-button *ngFor="let sp of species" value="{{sp.code}}" [checked]="spShow===sp.code">{{sp.scientificName}}</mat-radio-button>
        </mat-radio-group>
        <h4>{{'SURVEYS' | translate}}</h4>
        <mat-radio-group (change)="setShowSurvey($event)">
          <mat-radio-button *ngFor="let sv of surveys" value="{{sv.code}}" [checked]="surveyShow===sv.code">{{sv.code}}</mat-radio-button>
        </mat-radio-group>
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

  changeDisplay(showAbundancy: any){
    this.typeShow = showAbundancy.value;
    this.typeShowEmitter.emit(this.typeShow);
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
