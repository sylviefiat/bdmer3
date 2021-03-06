import { Component, Input, OnInit } from '@angular/core';
import { Platform } from './../../modules/datas/models/platform';

@Component({
  selector: 'bc-platform-preview',
  template: `
    <a [routerLink]="['/platform', id]">
      <mat-card>
        <mat-card-title-group>
          <img mat-card-sm-image *ngIf="thumbnail" [src]="thumbnail"/>
          <mat-card-title>{{ code }}</mat-card-title>
          <mat-card-subtitle *ngIf="codeCountry">{{ codeCountry }}</mat-card-subtitle>
        </mat-card-title-group>
        <mat-card-content>
          {{ description }}
        </mat-card-content>
        <mat-card-content>
          <h5 mat-subheader>{{ 'STATS' | translate }}</h5>
          <div>{{nZones}} {{'ZONES' | translate}}</div>
          <div>{{nSurveys}} {{'SURVEYS' | translate}}</div>
          <div>{{nStations}} {{'STATIONS' | translate}}</div>
          <div>{{nZonesPref}} {{'ZONES_PREF' | translate}}</div>
          <div>{{nCounts}} {{'COUNTS' | translate}}</div>
       </mat-card-content>
      </mat-card>
    </a>
  `,
  styles: [
    `
    mat-card {
      width: 400px;
      height: auto;
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
      margin: 5px 0 0;
    }
    mat-list-item {
      max-height:20px !important;
    }
  `,
  ],
})
export class PlatformPreviewComponent implements OnInit {
  @Input() platform: Platform;
  countries: string;
  nZones: number = 0;
  nSurveys: number = 0;
  nStations: number = 0;
  nZonesPref: number = 0;
  nCounts: number = 0;

  ngOnInit(){
      this.nZones = this.platform.zones ? this.platform.zones.length : 0;
      this.nSurveys += this.platform.surveys ? this.platform.surveys.length : 0;
      this.nStations += this.platform.stations ? this.platform.stations.length : 0;
      for(let z of this.platform.zones) {        
        this.nZonesPref += z.zonePreferences ? z.zonePreferences.length : 0;
      }
      if(this.platform.surveys){
        for(let c of this.platform.surveys){
          this.nCounts += c.counts ? c.counts.length : 0;
        }
      }    
  }

  get id() {
    return this.platform.code;
  }

  get description() {
    return this.platform.description;
  }

  get code() {
    return this.platform.code;
  }

  get codeCountry() {
    return this.platform.codeCountry;
  }

  get thumbnail(): string | boolean {
    // WHILE THERE IS NO GENERATED MAP OR IMAGE
    return null;
    //return "/assets/img/"+this.platform.code+".jpg"; 
  }
}
