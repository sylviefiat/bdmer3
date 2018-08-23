import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter, OnDestroy, OnChanges } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Csv2JsonService } from "../../modules/core/services/csv2json.service";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { Country } from "../../modules/countries/models/country";
import { Platform, Station } from "../../modules/datas/models/index";

@Component({
  selector: "bc-global-import-station",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div [formGroup]="form">
  <mat-card class="no-box-shadow">
  <mat-card-title-group>
  <mat-card-title>{{'IMPORT_CSV' | translate }} Stations</mat-card-title>
  <fa mat-card-sm-image [name]="'upload'" [border]=true [size]=2></fa>
  </mat-card-title-group>
  <mat-card-content>
  {{'IMPORT_DESC' | translate }}
  </mat-card-content>
  <mat-card-footer class="footer">
  <h5 mat-subheader>{{ 'DOWNLOAD_CSV_STATIONS' | translate }}</h5>

  <a href="{{getCsvUrl()}}" download>
  <fa [name]="'download'" [border]=true [size]=1></fa>
  </a>
  </mat-card-footer>
  <mat-card-actions align="start">
  <button (click)="fileInputStation.click(); clearInput()">
  <span>{{ 'IMPORT_CSV' | translate }}</span>
  <input #fileInputStation type="file" (change)="handleUploadCsv($event)" formControlName="stationInputFile" style="display:none;"  accept=".csv"/>
  </button>

  <button class="btn-danger" *ngIf="csvFileStation" (click)="deleteCsv()">
  <span>{{ 'DELETE_CSV' | translate }}</span>
  </button>
  <div *ngIf="csvFileStation">
  {{csvFileStation.name}} {{ 'SELECTED_CSV' | translate }}
  </div>
  </mat-card-actions>

  <mat-card-content class="error" *ngIf="(error$ | async) !== null" align="center">{{ 'ERROR_CSV_FIELD' | translate }} {{ error$ | async }}</mat-card-content>
  <mat-card-content class="msg" *ngIf="(importError$ | async)?.length === 0 && csvFileStation !== null && (error$ | async) === null" align="start">{{ 'VALID_DATA' | translate }}</mat-card-content>

  <mat-card-actions align="start" *ngIf="(importError$ | async)?.length > 0">
  <h2 class="errorList">{{'LIST_ERROR_STATION' | translate}}</h2>
  <mat-list>
  <div *ngFor="let e of (importError$ | async)">
  <mat-list-item class="errorList">
  {{e}}
  </mat-list-item>
  </div>
  </mat-list>
  </mat-card-actions>
  <p *ngIf="newStationInvalid === true" class="warning">{{ 'STATIONS_NOT_IN_ZONE' | translate }}</p>
  <bc-station-global-import-map (newStationInvalid)="isStationsInvalid($event)" [error]="error$ | async" [platform]="platform" [countries]="countries" [importError]="importError$ | async" [newStations]="newStations$ | async"></bc-station-global-import-map>
  </mat-card>
  </div>
  `
})
export class GlobalImportStationComponent implements OnInit, OnChanges, OnDestroy {
  @Input("group") public form: FormGroup;
  @Input() isAdmin: boolean;
  @Input() importError$: Observable<string[]>;
  @Input() error$: Observable<string | null>;
  @Input() countries: Country[];
  @Input() platform: Platform;
  @Input() docs_repo: string;
  @Input() locale: string;
  @Input() csvFileStation: any;
  @Input() csvFileCount: any;
  @Input() viewStation: boolean;
  @Output() stationFileEmitter = new EventEmitter<{ file: any; action: string }>();
  @Output() countFileEmitter = new EventEmitter<{ file: any; action: string }>();
  @Output() stayHereEmitter = new EventEmitter<string>();

  newStationInvalid: boolean = null;
  view: boolean = true;
  hasErr: boolean;
  hasIErr: boolean;
  hasErrSub: Subscription;
  hasIErrSub: Subscription;
  newStations$: Observable<Station[]>;
  constructor(private csv2JsonService: Csv2JsonService, private translate: TranslateService) {}

  ngOnInit() {
    this.hasErrSub = this.error$.subscribe(err => {
      this.hasErr = err !== null;
    });
    this.hasIErrSub = this.importError$.subscribe(ie => {
      this.hasIErr = ie.length > 0;
    });
  }

  ngOnChanges(changes) {
    if (!this.viewStation && this.view) {
      if (this.csvFileStation !== null && (this.hasErr || this.hasIErr)) {
        this.deleteCsv();
      } else if (this.csvFileStation !== null) {
        this.stationFileEmitter.emit({ file: this.csvFileStation, action: "save" });
      }
    }

    this.view = this.viewStation;
  }

  clearInput() {
    this.form.get("stationInputFile").reset();
  }

  isStationsInvalid(event) {
    this.newStationInvalid = event;
  }

  handleUploadCsv(csvFile: any) {
    let confirmRm;
    let msg = this.translate.instant("DELETE_COUNT_CONFIRM");

    if (csvFile.target.files && csvFile.target.files.length > 0) {
      this.newStationInvalid = false;
      this.newStations$ = this.csv2JsonService.extractStationPreviewData(csvFile.target.files[0]);

      if (this.csvFileCount !== null) {
        confirmRm = confirm(msg);
      } else {
        this.csvFileStation = csvFile.target.files[0];
        this.stationFileEmitter.emit({ file: this.csvFileStation, action: "check" });
      }

      if (confirmRm) {
        this.countFileEmitter.emit({ file: null, action: "delete" });
        this.csvFileStation = csvFile.target.files[0];
        this.stationFileEmitter.emit({ file: this.csvFileStation, action: "check" });
      }
    }
  }

  getCsvUrl() {
    return this.docs_repo + "importStation-" + this.locale + ".csv";
  }

  ngOnDestroy() {
    this.hasErrSub.unsubscribe();
    this.hasIErrSub.unsubscribe();
  }

  deleteCsv() {
    let msg = this.translate.instant(["DELETE_STATION_COUNT_CONFIRM", "DELETE_STATION_CONFIRM"]);

    let confirmRm;
    if (this.csvFileCount !== null) {
      confirmRm = confirm(msg.DELETE_STATION_COUNT_CONFIRM);
    } else {
      confirmRm = confirm(msg.DELETE_STATION_CONFIRM);
    }

    if (confirmRm) {
      this.stationFileEmitter.emit({ file: this.csvFileStation, action: "delete" });
      this.countFileEmitter.emit({ file: null, action: "delete" });
      this.form.get("stationInputFile").reset();
    } else {
      this.stayHereEmitter.emit("station");
    }
  }
}
