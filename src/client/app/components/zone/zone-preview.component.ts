import { Component, Input, OnInit } from '@angular/core';
import { Site,Zone } from './../../modules/datas/models/site';

@Component({
  selector: 'bc-zone-preview',
  template: `
    <a [routerLink]="['/zone', idSite, idZone]">
      <mat-card>
        <mat-card-title-group>
          <img mat-card-sm-image *ngIf="thumbnail" [src]="thumbnail"/>
          <mat-card-title>{{ code }}</mat-card-title>
          <mat-card-subtitle *ngIf="idSite">{{ idSite }}</mat-card-subtitle>
        </mat-card-title-group>
        <mat-card-content>
          {{ surface }}
        </mat-card-content>
        <mat-card-content>
          <h5 mat-subheader>{{ 'STATS' | translate }}</h5>
          <div>{{nTransects}} {{'TRANSECTS' | translate}}</div>
          <div>{{nCounts}} {{'COUNTS' | translate}}</div>
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
  @Input() idSite: string;
  nTransects: number = 0;
  nCounts: number = 0;

  ngOnInit(){
    this.nTransects = this.zone.transects.length;
    for(let c of this.zone.transects) {
      this.nCounts += c.counts.length;
    }

  }

  get idZone() {
    return this.zone.code;
  }

  get surface() {
    return this.zone.surface;
  }

  get code() {
    return this.zone.code;
  }

  get thumbnail(): string | boolean {
    return "/assets/img/"+this.zone.code+".jpg"; 
  }
}
