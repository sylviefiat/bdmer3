import { Component, Input } from '@angular/core';
import { Country } from './../../modules/countries/models/country';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'bc-country-preview',
  template: `
    <a [routerLink]="['/countries', id]">
      <md-card>
        <md-card-title-group>
          <img md-card-sm-image *ngIf="flag" [src]="flag"/>
          <md-card-title>{{ name }}</md-card-title>
          <md-card-subtitle>{{ code }}</md-card-subtitle>
        </md-card-title-group>
        <md-card-content>
          <md-card-subtitle>Country users</md-card-subtitle>
          <bc-user-detail *ngFor="let user of users" [user]="user" [hasactions]="false"></bc-user-detail>
        </md-card-content>
      </md-card>
    </a>
  `,
  styles: [
    `
    md-card {
      width: 400px;
      height: 300px;
      margin: 15px;
    }
    @media only screen and (max-width: 768px) {
      md-card {
        margin: 15px 0 !important;
      }
    }
    md-card:hover {
      box-shadow: 3px 3px 16px -2px rgba(0, 0, 0, .5);
    }
    md-card-title {
      margin-right: 10px;
    }
    md-card-title-group {
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
    md-card-content {
      margin-top: 15px;
      margin: 15px 0 0;
    }
    span {
      display: inline-block;
      font-size: 13px;
    }
    md-card-footer {
      padding: 0 25px 25px;
    }
  `,
  ],
})
export class CountryPreviewComponent {
  @Input() country: Country;

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

  get users() {
    return this.country.users;
  }

  get flag() {
    if(this.country.flag &&
      this.country.flag._attachments.flag.data){
      let blob = this.country.flag._attachments.flag;
      var file = new Blob([ blob.data ], {
        type : blob.type
      });
      return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))

    }    
    return null;
  }

}
