import { Component, Input, OnInit } from '@angular/core';
import { Platform,Zone,Survey } from './../../modules/datas/models/platform';

@Component({
  selector: 'bc-survey-preview',
  template: `
    <a [routerLink]="['/survey', codePlatform, code]">
      <mat-card>
        <mat-card-title-group>
          <img mat-card-sm-image *ngIf="thumbnail" [src]="thumbnail"/>
          <mat-card-title>{{ code }}</mat-card-title>
          <mat-card-subtitle><span *ngIf="codePlatform">{{ codePlatform }}</span></mat-card-subtitle>
        </mat-card-title-group>
        <mat-card-content>
          {{ dateStart | date:localDate }}, {{ dateEnd | date:localDate }}
        </mat-card-content>
        <mat-card-content>
          <p>{{'PARTICIPANTS' | translate}}: {{ participants }}</p>
          <p>{{'SURFACE_STATION' | translate}}: {{ surfaceStation }}</p>
          <p>{{'DESCRIPTION' | translate}}: {{ description }}</p>
       </mat-card-content>

        <mat-card-content>
          <h5 mat-subheader>{{ 'STATS' | translate }}</h5>
          <div role="listitem">{{nCounts}} {{'COUNTS' | translate}}</div>
       </mat-card-content>
      </mat-card>
    </a>
  `,
  styles: [
    `
    mat-card {
      width: 400px;
      margin: 15px;
    }
    @media only screen and (max-width: 768px) {
      mat-card {
        margin: 15px 0 !important;
      }
    }
    mat-card:hover {
      box-shadow: 3px 3px 16px -2px rgba(0, 0, 0, .5);
    }
    mat-card-title {
      margin-right: 10px;
    }
    mat-card-title-group {
      margin: 0;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    img {
      width: auto !important;
      margin-left: 5px;
    }
    mat-card-content {
      margin-top: 15px;
      margin: 15px 0 0;
    }
    mat-list-item {
      max-height:20px !important;
    }
  `,
  ],
})
export class SurveyPreviewComponent implements OnInit {  
  @Input() survey: Survey;
  @Input() platform: Platform;
  @Input() locale: string;
  nCounts: number = 0;

  ngOnInit(){
    if(this.survey.counts){
      this.nCounts = this.survey.counts.length;
    }
  }

  get id() {
    return this.survey.code;
  }

  get code() {
    return this.survey.code;
  }

  get codePlatform() {
    return this.platform.code;
  }

  get dateStart() {
    return this.survey.dateStart;
  }

  get dateEnd() {
    return this.survey.dateEnd;
  }

  get participants() {
    return this.survey.participants;
  }

  get surfaceStation() {
    return this.survey.surfaceStation;
  }

  get description() {
    return this.survey.description;
  }

  get localDate(){
    switch (this.locale) {
      case "fr":
        return 'dd-MM-yyyy';
      case "en":
      default:
        return 'MM-dd-yyyy';
    }
  }

  get thumbnail(): string | boolean {
    // WAIT FOR MAP GENERATION
    return null;
    //return "/assets/img/"+this.station.code+".jpg"; 
  }
}
