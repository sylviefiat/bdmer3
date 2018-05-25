
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Transect } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-result-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="container">
    <div class="legend">
        <h3>{{'FILTER' | translate}}</h3>
        <h4>{{'TYPE' | translate}}</h4>
        <mat-radio-group (change)="changeDisplay($event)">
          <mat-radio-button value="B" [checked]="typeShow==='B'">{{'DISPLAY_BIOMASS' | translate}}</mat-radio-button>
          <mat-radio-button value="A" [checked]="typeShow==='A'">{{'DISPLAY_ABUNDANCE' | translate}}</mat-radio-button>
        </mat-radio-group>
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
  `]
})
export class ResultFilterComponent implements OnInit/*, AfterViewInit*/ {
  @Input() species: Species[];
  @Input() surveys: Survey[];
  @Input() typeShow : string;
  @Input() spShow: string;
  @Input() surveyShow: string;
  @Output() typeShowEmitter= new EventEmitter<string>();
  @Output() spShowEmitter = new EventEmitter<string>();
  @Output() surveyShowEmitter = new EventEmitter<string>();

  constructor() {

  }

  ngOnInit(){  
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


}
