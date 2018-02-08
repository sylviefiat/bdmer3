import 'rxjs/add/operator/let';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

import { IAppState, getSpeciesInApp,getSiteListCurrentCountry, getSitePageMsg } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';
import { Site } from '../../modules/datas/models/site';

@Component({
  selector: 'bc-sites-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>{{ 'SITE_LIST' | translate}}</mat-card-title>
      <mat-card-content>
        <mat-form-field>
          <input type="text" matInput placeholder="{{ 'FILTER' | translate }}" [formControl]="filterFormControl" (keyup)="filterSites($event.target.value)">
        </mat-form-field>
        <mat-form-field class="right">
        <mat-select  placeholder="{{'ACTIONS' | translate}}" (change)="addSite($event.value)">
            <mat-option [value]="'form'">{{ 'ADD_SITE' | translate}}</mat-option>
            <mat-option [value]="'import'">{{ 'IMPORT' | translate}} {{ 'SITES' | translate}}</mat-option>
        </mat-select>
        </mat-form-field>     
      </mat-card-content>
      <mat-card-content class="msg" *ngIf="msg$ | async" align="start">{{ msg$ | async }}</mat-card-content> 
    </mat-card>
    <bc-site-preview-list [sites$]="filteredSites$"></bc-site-preview-list>
    
  `,
  styles: [
    `
    mat-card {
      text-align: center;
    }
    mat-card-title {
      display: flex;
      justify-content: center;
    }
    .msg {
      text-align: center;
      padding: 16px;     
      color: white;
      background-color: #4BB543;
    }
    .right {
      margin-left:15px;
    }
  `,
  ],
})
export class SiteListPageComponent implements OnInit {
  sites$: Observable<Site[]>;  
  msg$: Observable<string | null>;
  filteredSites$: Observable<Site[]>;
  filterFormControl = new FormControl('', []);

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {  
    this.sites$ = this.store.let(getSiteListCurrentCountry);
    this.msg$ = this.store.let(getSitePageMsg);
    this.store.dispatch(new SiteAction.LoadAction()); 
    this.filteredSites$ = this.sites$; 
  }

  addSite(type: string){
    type = type.charAt(0).toUpperCase() + type.slice(1);
    this.routerext.navigate(['/site'+type]);
  }

  filterSites(filter: string){
    filter=filter.toLowerCase();
    this.filteredSites$ = this.sites$.map(sites => 
      sites.filter(site => site.code.toLowerCase().indexOf(filter)!==-1 || 
        site.codeCountry.toLowerCase().indexOf(filter)!==-1 || 
        site.description.toLowerCase().indexOf(filter)!==-1
      )
    );
  }
}
