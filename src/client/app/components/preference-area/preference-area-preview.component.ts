import { Component, Input, OnInit } from '@angular/core';
import { Platform,Zone,ZonePreference } from './../../modules/datas/models/platform';

@Component({
  selector: 'bc-zone-preference-preview',
  template: `
    <a [routerLink]="['/zonePref', codePlatform, codeZone, code]">
      <mat-card>
        <mat-card-title-group>
          <img mat-card-sm-image *ngIf="thumbnail" [src]="thumbnail"/>
          <mat-card-title>{{ code }}</mat-card-title>
          <mat-card-subtitle><span *ngIf="codePlatform">{{ codePlatform }}</span> / <span *ngIf="codeZone">{{ codeZone }}</span></mat-card-subtitle>
        </mat-card-title-group>
        <mat-card-content>
          {{'SPECIES_CODE' | translate}}: {{ codeSpecies }}
        </mat-card-content>
        <mat-card-content>
          {{'PRESENCE' | translate}}: {{ presence }}
        </mat-card-content>
        <mat-card-content>
          {{'INFO_SOURCE' | translate}}: {{ infoSource }}
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
      max-length: 70%;
      word-break: break-all;
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
export class PreferenceAreaPreviewComponent implements OnInit {  
  @Input() zonePref: ZonePreference;
  @Input() zone: Zone;
  @Input() platform: Platform;
  nCounts: number = 0;

  ngOnInit(){
  }

  get id() {
    return this.zonePref.code;
  }

  get code() {
    return this.zonePref.code;
  }

  get codePlatform() {
    return this.platform.code;
  }

  get codeZone() {
    return this.zone.properties.code;
  }

  get codeSpecies() {
    return this.zonePref.codeSpecies;
  }

  get presence() {
    return this.zonePref.presence;
  }

  get infoSource() {
    return this.zonePref.infoSource;
  }

  get thumbnail(): string | boolean {
     return this.zonePref.picture;
  }
}
