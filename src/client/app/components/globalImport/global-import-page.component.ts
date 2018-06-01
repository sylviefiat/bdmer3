import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getisAdmin, getLangues, getPlatformImpErrors } from '../../modules/ngrx/index';
import { PlatformAction, SpeciesAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
  selector: 'bc-global-import-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <bc-global-import 
  (check)="handleCheck($event)"
  (upload)="handleUpload($event)"
  (pending)="handlePending($event)"
  (remove)="handleRemove($event)"
  (removeMsg)="removeMsg($event)"
  [platform]="platform$ | async"
  [error$]="error$"
  [importError$]="importError$"
  [isAdmin]="isAdmin$ | async"
  [locale]="locale$ | async"
  [docs_repo]="docs_repo">
  </bc-global-import>
  `,
})
export class GlobalImportPageComponent implements OnInit {
  platform$: Observable<Platform>;
  error$: Observable<string | null>;
  importError$: Observable<string[]>;
  isAdmin$: Observable<Country>;
  locale$: Observable<boolean>;
  docs_repo: string;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private router: Router) {
  }

  ngOnInit() {
    console.log("here");
    this.platform$ = this.store.let(getSelectedPlatform);
    this.importError$ = this.store.let(getPlatformImpErrors);
    this.error$ = this.store.let(getPlatformPageError);
    this.isAdmin$ = this.store.let(getisAdmin);
    this.store.dispatch(new SpeciesAction.LoadAction());
    this.locale$ = this.store.let(getLangues);
    this.docs_repo = "../../../assets/files/";
  }

  handleCheck(setFile) {
    switch (setFile.type) {
      case "station":
        this.store.dispatch(new PlatformAction.CheckStationCsvFile(setFile.file));
        break;
      case "survey":
        this.store.dispatch(new PlatformAction.CheckSurveyCsvFile(setFile.file));
        break;
      case "count":
        this.store.dispatch(new PlatformAction.CheckCountCsvFile(setFile.file));
        break;
      default:
        return;
    }
  }

  handlePending(setFile) {
    switch (setFile.type) {
      case "station":
        this.store.dispatch(new PlatformAction.AddPendingStationAction(setFile.file));
        break;
      case "survey":
        this.store.dispatch(new PlatformAction.AddPendingSurveyAction(setFile.file));
        break;
      default:
        return;
    }
  }

  handleUpload(setFile: any): void {
    if (setFile.file !== null) {
      switch (setFile.type) {
        case "station": {
          this.store.dispatch(new PlatformAction.ImportStationAction(setFile.file));
          break;
        }
        case "survey": {
          this.store.dispatch(new PlatformAction.ImportSurveyAction(setFile.file));
          break;
        }
        case "count": {
          this.store.dispatch(new PlatformAction.ImportCountAction(setFile.file));
          break;
        }
      }
    }
  }

  handleRemove(setFile: any): void {
    switch (setFile.type) {
      case "station":
        this.store.dispatch(new PlatformAction.RemovePendingStationAction(setFile.file));
        break;
      case "survey":
        this.store.dispatch(new PlatformAction.RemovePendingSurveyAction(setFile.file));
        break;
      default:
        return;
    }
  }

  removeMsg(){
    this.store.dispatch(new PlatformAction.RemoveMsgAction());
  }

  return() {
    this.routerext.navigate(['/platform/'], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }

  canDeactivate() {
    let confirmR = confirm('Discard changes?');
    if(confirmR){
      //this.store.dispatch(new PlatformAction.ResetAllPendingAction());
      return true;
    }else{
      return false;
    }
  }
}