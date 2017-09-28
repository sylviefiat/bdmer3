import { Component, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Country } from './../../modules/countries/models/country';


@Component({
  selector: 'bc-country-detail',
  template: `
    <md-card *ngIf="country">
      <md-card-title-group>
        <md-card-title>{{ name }}</md-card-title>
        <img md-card-sm-image *ngIf="flag" [src]="flag"/>
      </md-card-title-group>
      <md-card-content>
        <md-card-subtitle>Country users</md-card-subtitle>
        <bc-user-detail *ngFor="let user of users" [user]="user"></bc-user-detail>
      </md-card-content>
      <md-card-actions align="start">
        <button md-raised-button color="primary" (click)="addUser()">
          Add user
        </button>
        <button md-raised-button color="warn" (click)="removecountry.emit(country)">
          Delete Country
        </button>
      </md-card-actions>
    </md-card>

  `,
  styles: [
    `
    :host {
      display: flex;
      justify-content: center;
      margin: 75px 0;
    }
    md-card {
      max-width: 600px;
    }
    md-card-title-group {
      margin-left: 0;
    }
    img {
      width: 60px;
      min-width: 60px;
      margin-left: 5px;
    }
    md-card-content {
      margin: 15px 0 50px;
    }
    md-card-actions {
      margin: 25px 0 0 !important;
    }
    md-card-footer {
      padding: 0 25px 25px;
      position: relative;
    }
  `,
  ],
})
export class CountryDetailComponent{
  /**
   * Presentational components receieve data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'presentational' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   */
  @Input() country: Country;
  @Output() removecountry = new EventEmitter<Country>();

  constructor(private sanitizer: DomSanitizer, public routerext: RouterExtensions, public activatedRoute: ActivatedRoute){}

  /**
   * Tip: Utilize getters to keep templates clean
   */
  get id() {
    return this.country._id;
  }

  get name() {
    return this.country.name;
  }

  get code() {
    return this.country.code;
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

  addUser() {
    console.log(this.activatedRoute);
    this.routerext.navigate(['newuser'], {
      relativeTo: this.activatedRoute,
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }
}
