import 'rxjs/add/operator/let';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../../modules/core/index';

import { IAppState, getSiteListCurrentCountry,getSiteisLoaded } from '../../../modules/ngrx/index';
import { SiteAction } from '../../../modules/datas/actions/index';
import { Site } from '../../../modules/datas/models/site';

@Component({
  selector: 'bc-sites-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>{{ 'SITE_LIST' | translate}}</mat-card-title>
      <mat-form-field>
      <mat-select  placeholder="{{'ADD_SITE' | translate}}" (change)="addSite($event.value)">
          <mat-option [value]="'form'">{{ 'FORM' | translate}}</mat-option>
          <mat-option [value]="'import'">{{ 'IMPORT' | translate}}</mat-option>
      </mat-select>
      </mat-form-field>
    </mat-card>

    <bc-site-preview-list [siteList]="site$ | async"></bc-site-preview-list>
    
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
  `,
  ],
})
export class SiteListPageComponent implements OnInit {
  sites$: Observable<boolean>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {  
    console.log(getSiteisLoaded);
    this.sites$ = this.store.let(getSiteisLoaded);   
    console.log(this.sites$);
    this.store.dispatch(new SiteAction.LoadAction());  
  }

  addSite(type: string){
    type = type.charAt(0).toUpperCase() + type.slice(1);
    this.routerext.navigate(['/site'+type]);
  }
}
