import { Component, Input, OnInit } from '@angular/core';
import { Site } from './../../modules/datas/models/site';

@Component({
  selector: 'bc-site-preview',
  template: `
    <a [routerLink]="['/site', id]">
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
          <div>{{nCampaigns}} {{'CAMPAIGNS' | translate}}</div>
          <div>{{nZonesPref}} {{'ZONES_PREF' | translate}}</div>
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
export class SitePreviewComponent implements OnInit {
  @Input() site: Site;
  countries: string;
  nZones: number = 0;
  nCampaigns: number = 0;
  nTransects: number = 0;
  nZonesPref: number = 0;
  nCounts: number = 0;

  ngOnInit(){
      this.nZones = this.site.zones ? this.site.zones.length : 0;
      for(let z of this.site.zones) {
        this.nCampaigns += z.campaigns ? z.campaigns.length : 0;
        this.nTransects += z.transects ? z.transects.length : 0;
        this.nZonesPref += z.zonePreferences ? z.zonePreferences.length : 0;
        if(z.campaigns){
          for(let c of z.campaigns){
            this.nCounts += c.counts ? c.counts.length : 0;
          }
        }
    }

  }

  get id() {
    return this.site.code;
  }

  get description() {
    return this.site.description;
  }

  get code() {
    return this.site.code;
  }

  get codeCountry() {
    return this.site.codeCountry;
  }

  get thumbnail(): string | boolean {
    // WHILE THERE IS NO GENERATED MAP OR IMAGE
    return null;
    //return "/assets/img/"+this.site.code+".jpg"; 
  }
}
