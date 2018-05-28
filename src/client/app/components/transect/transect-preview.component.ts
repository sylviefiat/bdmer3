import { Component, Input, OnInit } from '@angular/core';
import { Platform,Zone,Transect } from './../../modules/datas/models/platform';

@Component({
  selector: 'bc-transect-preview',
  template: `
    <a [routerLink]="['/transect', codePlatform, codeZone, code]">
      <mat-card>
        <mat-card-title-group>
          <img mat-card-sm-image *ngIf="map" [src]="map"/>
          <mat-card-title>{{ code }}</mat-card-title>
          <mat-card-subtitle><span *ngIf="codePlatform">{{ codePlatform }}</span> / <span *ngIf="codeZone">{{ codeZone }}</span></mat-card-subtitle>
        </mat-card-title-group>
        <mat-card-content>
          {{ coord }}
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
export class TransectPreviewComponent implements OnInit {  
  @Input() transect: Transect;
  @Input() zone: Zone;
  @Input() platform: Platform;
  

  ngOnInit(){
    

  }

  get id() {
    return this.transect.properties.code;
  }

  get code() {
    return this.transect.properties.code;
  }

  get codePlatform() {
    return this.platform.code;
  }

  get codeZone() {
    return this.zone.properties.code;
  }

  get coord(){
    return this.transect.geometry["coordinates"];
  }

  get map(){
    return this.transect.staticMapTransect;
  }

  // get latitude() {
  //   return this.transect.latitude;
  // }

  // get longitude() {
  //   return this.transect.longitude;
  // }

  get thumbnail(): string | boolean {
    // WAIT FOR MAP GENERATION
    return null;
    //return "/assets/img/"+this.transect.code+".jpg"; 
  }
}
