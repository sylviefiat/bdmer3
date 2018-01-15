import { Component, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { Country, User } from './../../modules/countries/models/country';
import { WindowService } from './../../modules/core/services/index';

@Component({
  selector: 'bc-country-detail',
  template: `
    <mat-card *ngIf="country">
      <mat-card-title-group>
        <mat-card-title>{{ name }}</mat-card-title>
        <mat-card-subtitle>{{ code }}</mat-card-subtitle>
        <img mat-card-sm-image *ngIf="flag" [src]="flag"/>
      </mat-card-title-group>
      <mat-card-content>
        <mat-card-subtitle>{{ 'USERS' | translate}}</mat-card-subtitle>
        <bc-user-detail *ngFor="let user of users" [user]="user" [hasactions]="true"></bc-user-detail>
      </mat-card-content>
      <mat-card-actions align="start">
        <button mat-raised-button color="primary" (click)="addUser()">
          {{ 'ADD_USER' | translate}}
        </button>
        <button *ngIf="isNotAdminCountry() && isUserAdmin()" mat-raised-button color="warn" (click)="deleteCountry()">
          {{ 'DELETE_COUNTRY' | translate}}
        </button>
      </mat-card-actions>
    </mat-card>

  `,
  styles: [
    `
    :host {
      display: flex;
      justify-content: center;
      margin: 75px 0;
    }
    mat-card {
      max-width: 600px;
      min-width: 400px;
      min-height: 300px;
      margin: 15px;
    }
    mat-card-title-group {
      margin-left: 0;
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
      margin: 15px 0 50px;
    }
    mat-card-actions {
      margin: 25px 0 0 !important;
    }
    mat-card-footer {
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
  @Input() currentUser: User;
  @Output() removecountry = new EventEmitter<Country>();

  constructor(private sanitizer: DomSanitizer, public routerext: RouterExtensions, public activatedRoute: ActivatedRoute, private windowService: WindowService){
    
  }

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

  get users() {
    return this.country.users;
  }

  get flag() {
    //console.log(this.country._attachments);
    if(this.country._attachments &&
      this.country._attachments.flag){
      let blob = this.country._attachments.flag;
      var file = new Blob([ blob.data ], {
        type : blob.content_type
      });
      return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))

    }    
    return null;
  }

  addUser() {
    this.routerext.navigate(['newuser'], {
      relativeTo: this.activatedRoute,
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }

  isNotAdminCountry(): boolean {
    return this.country.code!=='AA';
  }

  isUserAdmin(): boolean {
    //console.log(this.currentUser);
    return this.currentUser && this.currentUser.role && this.currentUser.countryCode === 'AA';
  }

  deleteCountry() {
    if(this.windowService.confirm("Are you sure you want to delete this country from database ?"))
      return this.removecountry.emit(this.country);
  }

}
