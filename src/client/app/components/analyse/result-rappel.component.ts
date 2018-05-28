
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species } from '../../modules/datas/models/index';
import { IAnalyseState } from '../../modules/analyse/states/index';

@Component({
  selector: 'bc-result-rappel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ 'RESULT_RAPPEL' | translate }}</h2>
    <p class="subtitle">
      <span> {{ 'NUMBER_SURVEYS_SELECT' | translate }}: {{ analyseData.usedSurveys.length }} <fa [name]="'check'" [border]=false [size]=1></fa></span>
    </p>
    <p class="displayer">
      <a (click)="changeDisplay()">
        <span [class.show]="showRecap" [class.hide]="!showRecap">{{ 'HIDE_RECAP' | translate }}&nbsp;&nbsp;<fa [name]="'angle-double-down'" [border]=false [size]=1></fa></span>
        <span [class.show]="!showRecap" [class.hide]="showRecap">{{ 'SHOW_RECAP' | translate }}&nbsp;&nbsp;<fa [name]="'angle-double-right'" [border]=false [size]=1></fa></span>
      </a>
    </p>
    <mat-tab-group class="primer" [class.show]="showRecap" [class.hide]="!showRecap">    
      <mat-tab *ngFor="let survey of analyseData.usedSurveys; let i=index" label="{{survey.code}}">
        <p><label>{{ 'SURVEY_CODE' | translate}}:</label> {{survey.code}}, {{ survey.dateStart  | date:localDate }}, {{ survey.dateEnd  | date:localDate }}</p>
        <p><label>{{ 'PARTICIPANTS' | translate}}:</label> {{survey.participants}}</p>
        <p class="subtitle">{{ 'NUMBER_SP_SELECT' | translate}}: {{spInSurveys[i].length}}</p>
        <mat-tab-group class="spDisplay">
          <mat-tab *ngFor="let sp of spInSurveys[i]" label="{{sp.scientificName}}"> 
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
        <p><label>{{ 'ZONES' | translate}}:</label> <span *ngFor="let zone of znInSurveys[i];let i=index">{{(i>0)?',':''}} {{zone.properties.code}}</span></p>
      </mat-tab>
    </mat-tab-group>
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
    .show {
      display: block;
    }
    .hide {
      display: none;
    }
  `]
})
export class ResultRappelComponent implements OnInit {
  @Input() analyseData: IAnalyseState;
  @Input() locale: string;
  spInSurveys: Species[][];
  znInSurveys: Zone[][];
  showRecap: boolean = true;

  constructor() {  
  }

  ngOnInit() {
    this.getSpInSurvey();
    this.getZnInSurvey();
  }

  getSpInSurvey(){
    let spCodesInSurveys=[];
    this.spInSurveys= [];
    for(let i in this.analyseData.usedSurveys){
      spCodesInSurveys[i]=[];
      for(let c of this.analyseData.usedSurveys[i].counts){
        for(let m of c.mesures){
          if(spCodesInSurveys[i].indexOf(m.codeSpecies)<0)
            spCodesInSurveys[i].push(m.codeSpecies);
        }
      }
      this.spInSurveys[i] = this.analyseData.usedSpecies.filter(sp => spCodesInSurveys[i].indexOf(sp.code));
    }
  }

  getZnInSurvey(){
    this.znInSurveys= [];
    for(let i in this.analyseData.usedSurveys){
      this.znInSurveys[i] = this.analyseData.usedZones.filter(z => z.codePlatform == this.analyseData.usedSurveys[i].codePlatform);
    }
  }

  changeDisplay(){
    this.showRecap = !this.showRecap;
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


}
