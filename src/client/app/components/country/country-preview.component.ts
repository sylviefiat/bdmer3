import { Component, Input } from '@angular/core';
import { Country } from './../../modules/countries/models/country';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'bc-country-preview',
  template: `
    <a [routerLink]="['/countries', id]">
      <mat-card>
        <mat-card-title-group>
          <img mat-card-sm-image *ngIf="flag" [src]="flag"/>
          <mat-card-title>{{ name }}</mat-card-title>
          <mat-card-subtitle>{{ code }}</mat-card-subtitle>
          <mat-card-subtitle>{{ 'TYPE_PLATFORM' | translate }}: {{ type | translate }}</mat-card-subtitle>
        </mat-card-title-group>
        <mat-card-content>
          <mat-card-subtitle>{{ 'USERS' | translate}}</mat-card-subtitle>
          <ul *ngFor="let user of users">
            <li>{{user.surname}} {{user.name}}</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </a>
  `,
  styles: [
    `
    mat-card {
      width: 400px;
      min-height: 300px;
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
      display: block;
      max-width:100px;
      max-height:70px;
      width: auto;
      height: auto;
      margin-left: 5px;
    }
    mat-card-content {
      margin-top: 15px;
      margin: 15px 0 0;
    }
    span {
      display: inline-block;
      font-size: 13px;
    }
    mat-card-footer {
      padding: 0 25px 25px;
    }
  `,
  ],
})
export class CountryPreviewComponent {
  @Input() country: Country;
  @Input() platformTypeList: any[];

  constructor(private sanitizer: DomSanitizer){}

  get id() {
    return this.country._id;
  }

  get name() {
    return this.country.name;
  }

  get code() {
    return this.country.code;
  }

  get type() {
    return this.platformTypeList.filter(pt => pt.id===this.country.platformType)[0].value;
  }

  get users() {
    return this.country.users;
  }

  get flag() {
    if(this.country.flag){
      const flag = this.country.flag;
      return this.sanitizer.bypassSecurityTrustResourceUrl(flag);
    }else{
      return this.country.flag
    }
  }

}
