import { Component, Input } from '@angular/core';
import { Species } from './../../modules/datas/models/species';

@Component({
  selector: 'bc-species-preview',
  template: `
    <a [routerLink]="['/species', id]">
      <mat-card>
        <mat-card-title-group>
          <img mat-card-sm-image [src]="picture"/>
          <mat-card-title>{{ scientificName }}</mat-card-title>
          <mat-card-subtitle *ngIf="code">{{ code }}</mat-card-subtitle>
        </mat-card-title-group>
        <mat-card-content>
          <h5 mat-subheader>{{ 'SPECIES_COUNTRIES' | translate }}</h5>
          <ul>
            <li *ngFor="let dim of species.legalDimensions; let last = last;">
            {{ dim.codeCountry }}<span *ngIf="!last">,&nbsp;</span> 
            </li>
          </ul>
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
    li {
      display: inline-block;
      font-size: 13px;
      list-style-type: none;
    }
    mat-card-footer {
      padding: 0 25px 25px;
    }
  `,
  ],
})
export class SpeciesPreviewComponent{
  @Input() species: Species;
  countries: string;

  get id() {
    return this.species.code;
  }

  get scientificName() {
    return this.species.scientificName;
  }

  get code() {
    return this.species.code;
  }

  get picture(): string | boolean {
    return this.species.picture; 
  }
}
