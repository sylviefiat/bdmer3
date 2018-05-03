import { Component, Input, Output, EventEmitter, OnInit, AfterViewChecked } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { Country, User } from './../../modules/countries/models/country';
import { WindowService } from './../../modules/core/services/index';
import { IAppState, getPlatformInApp } from '../../modules/ngrx/index';
import { Platform } from '../../modules/datas/models/index';
import { PlatformAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-country-detail',
  template: `
  <mat-card *ngIf="country" class="actions">
  <mat-card-title-group>
  <div>
  <mat-card-title><a class="link" (click)="toCountries()">{{ 'COUNTRY_LIST' | translate}}</a> / {{ name }}</mat-card-title>
  <mat-card-subtitle>{{ code }}</mat-card-subtitle>
  </div>
  <div>
  <img mat-card-sm-image *ngIf="flag" [src]="flag"/>
  </div>
  </mat-card-title-group>
  <mat-card-actions>
  <mat-form-field>
  <mat-select  placeholder="{{'ACTIONS' | translate}}" (change)="actions($event.value)">
  <mat-option [value]="'addUser'">{{ 'ADD_USER' | translate}}</mat-option>
  <mat-option *ngIf="isNotAdminCountry() && isAdmin" class="warn" [value]="'deleteCountry'">{{ 'DELETE_COUNTRY' | translate}}</mat-option>
  </mat-select>
  </mat-form-field>        
  </mat-card-actions> 
  <mat-card-content class="msg" *ngIf="msg" align="start">{{ msg }}</mat-card-content> 
  </mat-card>
  <div class="inside">
  <bc-user-detail *ngFor="let user of users" [user]="user" [hasactions]="true"></bc-user-detail>
  <div *ngIf="noUsers">{{'NO_USERS' | translate}}</div>    
  </div>

  `,
  styles: [
  `
  mat-card {
    display: flex;
    flex-direction: column;
  }
  .msg {
    text-align: center;
    padding: 16px;     
    color: white;
    background-color: #4BB543;
  }
  .actions {
  }
  mat-card-title-group {
    justify-content: space-evenly;
  }
  mat-card-title-group img {
    max-width:100px;
    max-height: 70px;
    width: auto;
  }
  .inside {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    margin: 72px 0;

  }
  .inside mat-card {
    flex-grow: 1;
    margin:auto;
    min-width: 30%;
    text-align: left;
    padding: 1em 2em;
  }

  mat-card-title {
    font-style: italic;
  }
  mat-card-content {
    display: flex;
    justify-content:space-around;
    flex-direction: column;
  }
  mat-card-content.one{
    display: flex;
    justify-content:start;
  }
  mat-card-actions {
    display: flex;
    justify-content: center;
  }
  mat-form-field {
    margin-left:50px;
  }
  .warn:hover {
    background-color: #d9534f;
  }
  .link {
    cursor: pointer;
    text-decoration: underline;
  }
  `,
  ],
})
export class CountryDetailComponent implements OnInit{
  
  /**
   * Presentational components receieve data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'presentational' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   */
   @Input() country: Country;
   @Input() isAdmin: boolean;
   @Input() msg: string;
   @Output() removecountry = new EventEmitter;
   platforms$: Observable<Platform[]>;
   stringDelete: string;
   platforms: Platform[];

   constructor(private store: Store<IAppState>, private sanitizer: DomSanitizer, public routerext: RouterExtensions, public activatedRoute: ActivatedRoute, private windowService: WindowService){
     
   }

   ngOnInit(){
     this.platforms$ = this.store.let(getPlatformInApp);
     this.store.dispatch(new PlatformAction.LoadAction());

     this.platforms$ = this.platforms$
     .map(platforms => platforms.filter(platform => platform.codeCountry === this.country.code));
     
     this.platforms$.subscribe(
       (res) => {
         console.log(res)
         if(!this.platforms)
           this.platforms = res;
         
         this.stringDelete = "Are you sure you want to delete this country from database ? ";
         for(let i = 0; i < res.length; i++){
           if(i == 0){
             if(i == res.length - 1){
               this.stringDelete += "It will also delete platform(s): " + res[i].code + ".";
             }else{
               this.stringDelete += "It will also delete platform(s): " + res[i].code;
             }
           }else if(i == res.length - 1 && i != 0){
             this.stringDelete += " " + res[i].code + ".";
           }else{
             this.stringDelete += ", " + res[i].code;
           }
         }
       });
   }

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

   get noUsers() {
     return !this.country.users || this.country.users.length <= 0;
   }

   get flag() {
     if(this.country.flag){
       const flag = this.country.flag;
       return this.sanitizer.bypassSecurityTrustResourceUrl(flag);
     }else{
       return this.country.flag
     }
   }

   actions(action: string) {
     switch (action) {
       case "addUser":
       this.addUser();
       break;
       case "deleteCountry":
       this.deleteCountry();
       break;
       default:
       break;
     }
   }

   toCountries() {
     this.routerext.navigate(['countries']);
   }

   addUser() {
     this.routerext.navigate(['userForm'], {
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

   deleteCountry() {
     if(this.windowService.confirm(this.stringDelete)){
       return this.removecountry.emit({country:this.country, platforms: this.platforms});
     }
   }

 }
