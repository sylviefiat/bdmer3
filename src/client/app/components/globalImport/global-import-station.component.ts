import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'bc-global-import-station',
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
  <a *ngIf="!isAdmin" href="{{getCsvUrl()}}" download>
  <fa [name]="'download'" [border]=true [size]=1></fa>
  </a>
  </mat-card-footer>
  <mat-card-actions align="start">
  <button (click)="fileInputStation.click()">
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

  <mat-card-content class="error" *ngIf="error  !== null" align="center">{{ 'ERROR_CSV_FIELD' | translate }} {{ error }}</mat-card-content>
  <mat-card-content class="msg" *ngIf="importError.length === 0 && csvFileStation !== null && error === null" align="start">{{ 'VALID_DATA' | translate }}</mat-card-content>

  <mat-card-actions align="start" *ngIf="importError.length > 0">
  <h2 class="errorList">{{'LIST_ERROR_STATION' | translate}}</h2>
  <mat-list>
  <div *ngFor="let e of importError">
  <mat-list-item class="errorList"> 
  {{e}}
  </mat-list-item>
  </div>
  </mat-list>
  </mat-card-actions>

  </mat-card>
  </div>
  `,
})
export class GlobalImportStationComponent implements OnInit, OnChanges {
  @Input('group') public form: FormGroup;
  @Input() isAdmin: boolean;
  @Input() importError: string[];
  @Input() error: string | null;
  @Input() docs_repo: string;
  @Input() locale: string;
  @Input() csvFileStation: any;
  @Input() csvFileCount: any;
  @Input() viewStation: boolean;
  @Output() stationFileEmitter = new EventEmitter<{ file: any, save: boolean }>();
  @Output() countFileEmitter = new EventEmitter<{ file: any, save: boolean }>();
  @Output() stayHereEmitter = new EventEmitter<string>();

  constructor() {

  }

  ngOnInit() {
    if (this.csvFileStation !== null) {
      this.stationFileEmitter.emit({ file: this.csvFileStation, save: false });
    }
  }

  ngOnChanges(){
    console.log("station: " + this.viewStation)
    if(!this.viewStation){
      if (this.csvFileStation !== null && (this.error !== null || this.importError.length > 0)) {
        this.deleteCsv();
      } else if (this.csvFileStation !== null) {
        this.stationFileEmitter.emit({ file: this.csvFileStation, save: true });
      }
    }
  }

  handleUploadCsv(csvFile: any) {
    if (csvFile.target.files && csvFile.target.files.length > 0) {
      this.csvFileStation = csvFile.target.files[0];
      this.stationFileEmitter.emit({ file: this.csvFileStation, save: false });
    }
  }

  getCsvUrl() {
    return this.docs_repo + "importStation-" + this.locale + ".csv";
  }


  deleteCsv() {
    let confirmRm;
    if (this.csvFileCount !== null) {
      confirmRm = confirm('It will delete file : Station, Count. Are you sure to continue?');
    } else {
      confirmRm = confirm('It will delete file : Station. Are you sure to continue?');
    }
    if (confirmRm) {
      this.form.get('stationInputFile').reset();
      this.stationFileEmitter.emit({ file: null, save: true });
      this.countFileEmitter.emit({ file: null, save: true });
    } else {
      this.stayHereEmitter.emit('station');
    }
  }
}