import 'rxjs/add/operator/let';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

import { IAppState, getSpeciesInApp,getPlatformListCurrentCountry, getPlatformPageMsg } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { Platform } from '../../modules/datas/models/platform';

@Component({
  selector: 'bc-platforms-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>{{ 'PLATFORM_LIST' | translate}}</mat-card-title>
      <mat-card-content>
        <mat-form-field>
          <input type="text" matInput placeholder="{{ 'FILTER' | translate }}" [formControl]="filterFormControl" (keyup)="filterPlatforms($event.target.value)">
        </mat-form-field>
        <mat-form-field class="right">
        <mat-select  placeholder="{{'ACTIONS' | translate}}" (change)="addPlatform($event.value)">
            <mat-option [value]="'form'">{{ 'ADD_PLATFORM' | translate}}</mat-option>
            <mat-option [value]="'import'">{{ 'IMPORT' | translate}} {{ 'PLATFORMS' | translate}}</mat-option>
        </mat-select>
        </mat-form-field>     
      </mat-card-content>
      <mat-card-content class="msg" *ngIf="msg$ | async" align="start">{{ msg$ | async }}</mat-card-content> 
    </mat-card>
    <bc-platform-preview-list [platforms$]="filteredPlatforms$"></bc-platform-preview-list>
    
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
export class PlatformListPageComponent implements OnInit {
  platforms$: Observable<Platform[]>;  
  msg$: Observable<string | null>;
  filteredPlatforms$: Observable<Platform[]>;
  filterFormControl = new FormControl('', []);

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {  
    this.platforms$ = this.store.let(getPlatformListCurrentCountry);
    this.msg$ = this.store.let(getPlatformPageMsg);
    this.store.dispatch(new PlatformAction.LoadAction()); 
    this.filteredPlatforms$ = this.platforms$; 
  }

  addPlatform(type: string){
    type = type.charAt(0).toUpperCase() + type.slice(1);
    this.routerext.navigate(['/platform'+type]);
  }

  filterPlatforms(filter: string){
    filter=filter.toLowerCase();
    this.filteredPlatforms$ = this.platforms$.map(platforms => 
      platforms.filter(platform => platform.code.toLowerCase().indexOf(filter)!==-1 || 
        platform.codeCountry.toLowerCase().indexOf(filter)!==-1 || 
        platform.description.toLowerCase().indexOf(filter)!==-1
      )
    );
  }
}
