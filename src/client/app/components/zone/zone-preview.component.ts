import { Component, Input, OnInit } from '@angular/core';
import { Platform,Zone } from './../../modules/datas/models/platform';

@Component({
  selector: 'bc-zone-preview',
  template: `
    <a [routerLink]="['/zone', idPlatform, idZone]">
      <mat-card>
        <mat-card-title-group>
          <img mat-card-sm-image *ngIf="map" [src]="map"/>
          <mat-card-title>{{ code }}</mat-card-title>
          <mat-card-subtitle *ngIf="idPlatform">{{ idPlatform }}</mat-card-subtitle>
        </mat-card-title-group>
        <mat-card-content>
          {{ surface }} m²
        </mat-card-content>
        <mat-card-content>
          <h5 mat-subheader>{{ 'STATS' | translate }}</h5>
          <div>{{nStations}} {{'STATIONS' | translate}}</div>
          <div>{{nZonesPrefs}} {{'ZONES_PREF' | translate}}</div>
       </mat-card-content>
      </mat-card>
    </a>
  `,
  styles: [
    `
    mat-card {
      width: 400px;
      height: 300px;
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
export class ZonePreviewComponent implements OnInit {
  @Input() zone: Zone;
  @Input() idPlatform: string;
  nZonesPrefs: number = 0;
  nStations: number = 0;

  ngOnInit(){
    this.nZonesPrefs = this.zone.zonePreferences ? this.zone.zonePreferences.length : 0;

  }

  get idZone() {
    return this.zone.properties.code;
  }

  get map(){
    return this.zone.staticmap;
  }

  get surface() {
    return this.zone.properties.surface;
  }

  get code() {
    return this.zone.properties.code;
  }

  get thumbnail(): string | boolean {
    // WAIT FOR MAP GENERATION
    return null;
    //return "/assets/img/"+this.zone.code+".jpg"; 
  }
}