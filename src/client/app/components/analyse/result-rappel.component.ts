
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species } from '../../modules/datas/models/index';
import { IAnalyseState } from '../../modules/analyse/states/index';

@Component({
  selector: 'bc-result-rappel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ 'RESULT_RAPPEL' | translate }}</h2>
    <mat-tab-group class="primer">
      <mat-tab *ngFor="let survey of analyseData.usedSurveys; let i=index" label="{{survey.code}}">
        <div>{{ 'SURVEY_CODE' | translate}}: {{survey.code}}, {{ survey.dateStart  | date:localDate }}, {{ survey.dateEnd  | date:localDate }}</div>
        <div>{{ 'PARTICIPANTS' | translate}}: {{survey.participants}}</div>
        <mat-tab-group>
          <mat-tab *ngFor="let sp of spInSurveys[i]" label="{{sp.scientificName}}">
            <!-- PHOTO -->
            <div>{{ 'SP' | translate }}: {{ sp.scientificName }}</div>
            <div>{{ 'SPECIES_VERNACULAR_NAME' | translate }}: 
              <span *ngFor="let name of sp.names;let i=index">{{(i>0)?',':''}} {{name.name}} ({{name.lang}})</span>
            </div>
            <div>{{ 'DISTRIBUTION' | translate }}: {{ sp.distribution }}</div>
            <div>{{ 'HABITAT_PREF' | translate }}: {{ sp.habitatPreference }}</div>
            <div>{{ 'LEGAL_DIM_COUNTRIES' | translate }}: 
              <span *ngFor="let ld of sp.legalDimensions;let i=index">{{(i>0)?',':''}} {{ld.longMin}}/{{ld.longMax}} ({{ld.codeCountry}})</span>
            </div>
          </mat-tab>
        </mat-tab-group>
        <div>{{ 'ZONES' | translate}}: <span *ngFor="let zone of znInSurveys[i];let i=index">{{(i>0)?',':''}} {{zone.code}}</span></div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [
  `
    h2 {
      margin-left: 25px;
    }
    mat-tab-group.primer {
      margin: 25px 72px;
      background-color: white;
    }
  `]
})
export class ResultRappelComponent implements OnInit {
  @Input() analyseData: IAnalyseState;
  @Input() locale: string;
  spInSurveys: Species[][];
  znInSurveys: Zone[][];

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
