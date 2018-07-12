import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from "@angular/router";
import { Subscription, ISubscription } from "rxjs/Subscription";

import { RouterExtensions, Config } from "../../modules/core/index";
import { Platform } from "../../modules/datas/models/index";
import { Country } from "../../modules/countries/models/country";

import {
  IAppState,
  getPlatformPageError,
  getSelectedPlatform,
  getPlatformPageMsg,
  getisAdmin,
  getLangues,
  getPlatformImpErrors
} from "../../modules/ngrx/index";
import { PlatformAction, SpeciesAction } from "../../modules/datas/actions/index";
import { CountriesAction } from "../../modules/countries/actions/index";

@Component({
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "bc-global-import",
  templateUrl: "./global-import.component.html",
  styleUrls: ["./global-import.component.css"]
})
export class GlobalImportComponent implements OnInit {
  @ViewChild("stepper") stepper: MatStepper;

  @Input() platform: Platform;
  @Input() error$: Observable<string | null>;
  @Input() importError$: Observable<string[]>;
  @Input() countries: Country[];
  @Input() isAdmin: boolean;
  @Input() locale: boolean;
  @Input() docs_repo: string;
  @Output() pending = new EventEmitter<{ file: any; type: string }>();
  @Output() check = new EventEmitter<{ file: any; type: string }>();
  @Output() upload = new EventEmitter<{ file: any; type: string }>();
  @Output() remove = new EventEmitter<{ file: any; type: string }>();
  @Output() removeMsg = new EventEmitter<any>();

  csvFileSurvey: any;
  csvFileStation: any;
  csvFileCount: any;
  viewStation: boolean = true;
  viewSurvey: boolean;
  viewCount: boolean;
  pendingStation: boolean = false;
  pendingSurvey: boolean = false;

  stationForm: FormGroup = new FormGroup({
    stationInputFile: new FormControl()
  });

  countForm: FormGroup = new FormGroup({
    countInputFile: new FormControl()
  });

  surveyForm: FormGroup = new FormGroup({
    surveyInputFile: new FormControl()
  });

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private router: Router) {}

  ngOnInit() {
    this.csvFileStation = null;
    this.csvFileSurvey = null;
    this.csvFileCount = null;
  }

  setStationFile(setFile) {
    switch (setFile.action) {
      case "check": {
        if (this.pendingStation) {
          this.remove.emit({ file: this.csvFileStation, type: "station" });
          this.pendingStation = false;
        }
        this.csvFileStation = setFile.file;
        this.check.emit({ file: setFile.file, type: "station" });
        break;
      }
      case "save": {
        this.pending.emit({ file: setFile.file, type: "station" });
        this.pendingStation = true;
        break;
      }
      case "delete": {
        if (this.pendingStation) {
          this.remove.emit({ file: setFile.file, type: "station" });
          this.pendingStation = false;
        } else {
          this.removeMsg.emit();
        }
        this.csvFileStation = null;
        break;
      }
    }
  }

  setSurveyFile(setFile) {
    switch (setFile.action) {
      case "check": {
        if (this.pendingSurvey) {
          this.remove.emit({ file: this.csvFileSurvey, type: "survey" });
          this.pendingSurvey = false;
        }
        this.csvFileSurvey = setFile.file;
        this.check.emit({ file: setFile.file, type: "survey" });
        break;
      }
      case "save": {
        this.pending.emit({ file: setFile.file, type: "survey" });
        this.pendingSurvey = true;
        break;
      }
      case "delete": {
        if (this.pendingSurvey) {
          this.remove.emit({ file: setFile.file, type: "survey" });
          this.pendingSurvey = false;
        } else {
          this.removeMsg.emit();
        }
        this.csvFileSurvey = null;
        break;
      }
    }
  }

  setCountFile(setFile) {
    this.csvFileCount = setFile.file;

    switch (setFile.action) {
      case "check": {
        this.csvFileCount = setFile.file;
        this.check.emit({ file: setFile.file, type: "count" });
        break;
      }
      case "delete": {
        this.removeMsg.emit();
        this.csvFileCount = null;
        break;
      }
    }
  }

  stayOn(step: string) {
    let i;
    switch (step) {
      case "survey":
        i = 1;
        break;
      case "count":
        i = 2;
        break;
      case "station":
      default:
        i = 0;
        break;
    }
    this.selectIndex(i);
  }

  changeIndex(e) {
    switch (e.selectedIndex) {
      case 0: {
        this.viewStation = true;
        break;
      }
      case 1: {
        this.viewSurvey = true;
        break;
      }
      case 2: {
        this.viewCount = true;
        break;
      }
    }

    switch (e.previouslySelectedIndex) {
      case 0: {
        this.viewStation = false;
        break;
      }
      case 1: {
        this.viewSurvey = false;
        break;
      }
      case 2: {
        this.viewCount = false;
        break;
      }
    }
  }

  selectIndex(i) {
    setTimeout(() => {
      this.stepper.selectedIndex = i;
    }, 0);
  }

  send() {
    if (this.csvFileStation !== null) {
      this.upload.emit({ file: this.csvFileStation, type: "station" });
    }
    if (this.csvFileSurvey !== null) {
      this.upload.emit({ file: this.csvFileSurvey, type: "survey" });
    }
    if (this.csvFileCount !== null) {
      this.upload.emit({ file: this.csvFileCount, type: "count" });
    }
  }

  return() {
    this.routerext.navigate(["/platform/"], {
      transition: {
        duration: 1000,
        name: "slideTop"
      }
    });
  }
}
