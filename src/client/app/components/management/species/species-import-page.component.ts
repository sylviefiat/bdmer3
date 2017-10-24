import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../../modules/core/index';
import { Species } from '../../../modules/datas/models/species';

import { IAppState, getSpeciesPageError, getSelectedSpecies, getSpeciesPageMsg } from '../../../modules/ngrx/index';
import { SpeciesAction } from '../../../modules/datas/actions/index';
import { CountriesAction } from '../../../modules/countries/actions/index';

@Component({
    selector: 'bc-species-import-page',
    template: `
    <md-card>
      <md-card-title class="toolbar">Import new species</md-card-title>
      <md-card-subtitle>Import csv file containing species definitions</md-card-subtitle>
      
      <md-card-content align="center">
      <p>
        <button (click)="fileInput.click()">
          <fa [name]="'upload'" [border]=true [size]=1></fa>
          <span>Import CSV</span>
          <input #fileInput type="file" (change)="handleUpload($event)" style="display:none;"  accept=".csv"/>
        </button>
      </p>
      <p align="right" *ngIf="!(msg$ | async)">
        <button class="question" (click)="changeNeedHelp()" title="Help on format">
            <fa [name]="'question'" [border]=false [size]=2></fa>
        </button>
      </p>
      <p id="help" *ngIf="needHelp">format to be used</p>
      </md-card-content>
      <md-card-content class="error" *ngIf="error$ | async" align="center">{{ error$ | async }}</md-card-content>
      <md-card-content *ngIf="msg$ | async" align="start">
          <p class="msg">{{ msg$ | async }}</p>
          <p class="actionButtons"><a [routerLink]="['/management']" [routerLinkActive]="['router-link-active']" [routerLinkActiveOptions]="{exact:true}">Back to management</a></p>
      </md-card-content> 

    </md-card>
  `,
    styles: [`
    :host {
      display: flex;
      justify-content: center;
      margin: 75px 0;
    }

    md-card {
      max-width: 600px;
      min-width: 400px;
      margin: 15px;
    }
    md-card-title-group, md-card-title {
        width: 100%;
    }
    md-card-content {
      padding-top:20px;
    }
    md-card-title-group {
      margin-left: 0;
      margin-bottom:20px;
    }
    md-card-footer {
      width: 100%;
    }
    .toolbar {
      background-color: #106cc8;
      color: rgba(255, 255, 255, 0.87);
      display: block;
      padding:10px;
    }
    .actionButtons {
        text-decoration: underline;
        cursor: pointer;
        color: #555;
        text-align:right;
    }
    .question {
        padding: 0px;
        border-radius:120px;
        height:40px;
        width:40px;
    }
    .msg {
      text-align: center;
      padding: 16px;     
      color: white;
      background-color: #4BB543;
    }
    .error {
      text-align: center;
      padding: 16px;
      color: white;
      background-color: red;
    }
  `]
})
export class SpeciesImportPageComponent implements OnInit, OnDestroy {
    error$: Observable<string | null>;
    msg$: Observable<string | null>;
    actionsSubscription: Subscription;
    needHelp: boolean = false;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {

    }

    ngOnInit() {
        this.error$ = this.store.let(getSpeciesPageError);
        this.msg$ = this.store.let(getSpeciesPageMsg);
    }

    ngOnDestroy() {

    }

    handleUpload(csvFile: any): void {
        console.log(csvFile);
        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.store.dispatch(new SpeciesAction.ImportSpeciesAction(csvFile.target.files[0]));
        } else {
            this.store.dispatch(new SpeciesAction.AddSpeciesFailAction('No csv file found'));
        }
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }
}