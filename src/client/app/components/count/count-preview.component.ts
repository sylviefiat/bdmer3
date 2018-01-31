import { Component, Input, OnInit } from '@angular/core';
import { Site,Zone,Campaign, Count } from './../../modules/datas/models/site';

@Component({
  selector: 'bc-count-preview',
  template: `
    <a [routerLink]="['/count', codeSite, codeZone, codeCampaign, code]">
      <mat-card>
        <mat-card-title-group>
          <img mat-card-sm-image *ngIf="thumbnail" [src]="thumbnail"/>
          <mat-card-title>{{ code }}</mat-card-title>
          <mat-card-subtitle><span *ngIf="codeSite">{{ codeSite }}</span> / <span *ngIf="codeZone">{{ codeZone }}</span> / <span *ngIf="codeCampaign">{{ codeCampaign }}</span></mat-card-subtitle>
        </mat-card-title-group>
        <mat-card-content>
          {{ date }}
        </mat-card-content>
        <mat-card-content>
          {{ 'COUNT_MESURES' | translate }}: {{ mesures }}
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
export class CountPreviewComponent implements OnInit {  
  @Input() count: Count;
  @Input() campaign: Campaign;
  @Input() zone: Zone;
  @Input() site: Site;
  nCounts: number = 0;

  ngOnInit(){

  }

  get id() {
    return this.count.code;
  }

  get code() {
    return this.count.code;
  }

  get codeSite() {
    return this.site.code;
  }

  get codeZone() {
    return this.zone.code;
  }

  get codeCampaign() {
    return this.campaign.code;
  }

  get date() {
    return this.count.date;
  }

  get mesures() {
    return this.count.mesures;
  }

  get thumbnail(): string | boolean {
    // WAIT FOR MAP
    return null;
    //return "/assets/img/"+this.count.code+".jpg"; 
  }
}
