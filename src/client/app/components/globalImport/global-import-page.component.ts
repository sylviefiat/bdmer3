import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, ViewChild } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { RouterExtensions, Config } from "../../modules/core/index";
import { Platform } from "../../modules/datas/models/index";
import { Country } from "../../modules/countries/models/country";

import {
  IAppState,
  getPlatformPageError,
  getSelectedPlatform,
  getPlatformPageMsg,
  getAllCountriesInApp,
  getisAdmin,
  getLangues,
  getPlatformImpErrors,
  getCountryCountList
} from "../../modules/ngrx/index";
import { PlatformAction, SpeciesAction } from "../../modules/datas/actions/index";
import { CountriesAction } from "../../modules/countries/actions/index";

@Component({
  selector: "bc-global-import-page",
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
  [countries]="countries$ | async"
  [countriesCount]="countriesCount$ | async"
  [importError$]="importError$"
  [isAdmin]="isAdmin$ | async"
  [locale]="locale$ | async"
  [docs_repo]="docs_repo">
  </bc-global-import>
  `
})
export class GlobalImportPageComponent implements OnInit {
  platform$: Observable<Platform>;
  error$: Observable<string | null>;
  importError$: Observable<string[]>;
  isAdmin$: Observable<Country>;
  locale$: Observable<boolean>;
  docs_repo: string;
  submit: boolean = false;
  countries$: Observable<Country[]>;
  countriesCount$: Observable<String[]>;

  constructor(private translate: TranslateService, private store: Store<IAppState>, public routerext: RouterExtensions, private router: Router) {}

  ngOnInit() {
    this.platform$ = this.store.select(getSelectedPlatform);
    this.importError$ = this.store.select(getPlatformImpErrors);
    this.error$ = this.store.select(getPlatformPageError);
    this.isAdmin$ = this.store.select(getisAdmin);
    this.store.dispatch(new SpeciesAction.LoadAction());
    this.locale$ = this.store.select(getLangues);
    //this.docs_repo = "../../../assets/files/";
    this.docs_repo = "assets/files/";
    this.countries$ = this.store.select(getAllCountriesInApp);
    this.countriesCount$ = this.store.select(getCountryCountList);
  }

  handleCheck(setFile) {
    switch (setFile.type) {
      case "station": {
        this.store.dispatch(new PlatformAction.CheckStationCsvFile(setFile.file));
        break;
      }
      case "survey": {
        this.store.dispatch(new PlatformAction.CheckSurveyCsvFile(setFile.file));
        break;
      }
      case "countNoMesures":
      case "count": {
        this.store.dispatch(new PlatformAction.CheckCountCsvFile({csvFile: setFile.file, type: setFile.type}));
        break;
      }
      default:
        return;
    }
  }

  handlePending(setFile) {
    switch (setFile.type) {
      case "station": {
        this.store.dispatch(new PlatformAction.AddPendingStationAction(setFile.file));
        break;
      }
      case "survey": {
        this.store.dispatch(new PlatformAction.AddPendingSurveyAction(setFile.file));
        break;
      }
      default:
        return;
    }
  }

  handleUpload(setFile: any): void {
    this.submit = true;

    switch (setFile.type) {
      case "station": {
        this.store.dispatch(new PlatformAction.ImportStationAction(setFile.file));
        break;
      }
      case "survey": {
        this.store.dispatch(new PlatformAction.ImportSurveyAction(setFile.file));
        break;
      }
      case "countNoMesures":
      case "count": {
        this.store.dispatch(new PlatformAction.ImportCountAction({csvFile: setFile.file, type: setFile.type}));
        break;
      }
    }
  }

  handleRemove(setFile: any): void {
    switch (setFile.type) {
      case "station": {
        this.store.dispatch(new PlatformAction.RemovePendingStationAction(setFile.file));
        break;
      }
      case "survey": {
        this.store.dispatch(new PlatformAction.RemovePendingSurveyAction(setFile.file));
        break;
      }
      default:
        return;
    }
  }

  removeMsg() {
    this.store.dispatch(new PlatformAction.RemoveMsgAction());
  }

  return() {
    this.routerext.navigate(["/platform/"], {
      transition: {
        duration: 1000,
        name: "slideTop"
      }
    });
  }

  canDeactivate() {
    if (!this.submit) {
      let msg = this.translate.instant("DISCARD_CHANGE");

      let confirmR = confirm(msg);
      if (confirmR) {
        this.store.dispatch(new PlatformAction.ResetAllPendingAction());
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
