import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'bc-global-import-count',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div [formGroup]="form">
  <mat-card class="no-box-shadow">
  <mat-card-title-group>
  <mat-card-title>{{'IMPORT_CSV' | translate }} Counts</mat-card-title> 
  <fa mat-card-sm-image [name]="'upload'" [border]=true [size]=2></fa> 
  </mat-card-title-group>
  <mat-card-content>
  {{'IMPORT_DESC' | translate }}    
  </mat-card-content>
  <mat-card-content class="warn">
  {{'IMPORT_DESC_DATE' | translate }}      
  </mat-card-content>
  <mat-card-footer class="footer">
  <h5 mat-subheader>{{ 'DOWNLOAD_CSV_COUNTS' | translate }}</h5>
  <a *ngIf="!isAdmin" href="{{getCsvUrl('Count')}}" download>
  <fa [name]="'download'" [border]=true [size]=1></fa>
  </a>
  </mat-card-footer>
  <mat-card-actions align="start">
  <button (click)="fileInputCount.click()">
  <span>{{ 'IMPORT_CSV' | translate }}</span>
  <input #fileInputCount type="file" (change)="handleUploadCsv($event, 'count')" formControlName="countInputFile" style="display:none;"  accept=".csv"/>
  </button>
  <button class="btn-danger" *ngIf="csvFileCount" (click)="deleteCsv('count')">
  <span>{{ 'DELETE_CSV' | translate }}</span>
  </button>
  <div *ngIf="csvFileCount">
  {{csvFileCount.name}} {{ 'SELECTED_CSV' | translate }}
  </div>
  </mat-card-actions>

  <mat-card-content class="error" *ngIf="error  !== null" align="center">{{ 'ERROR_CSV_FIELD' | translate }} {{ error }}</mat-card-content>
  <mat-card-content class="msg" *ngIf="importError.length === 0 && csvFileCount !== null && error === null" align="start">{{ 'VALID_DATA' | translate }}</mat-card-content>

  <mat-card-actions align="start" *ngIf="importError.length > 0">
  <h2 class="errorList">{{'LIST_ERROR_COUNT' | translate}}</h2>
  <mat-list>
  <div *ngFor="let count of importError">
  <mat-list-item class="errorList"> 
  {{count}}
  </mat-list-item>
  </div>
  </mat-list>
  </mat-card-actions>
  </mat-card>
  </div>
  `,
})
export class GlobalImportCountComponent implements OnInit, OnChanges {
  @Input('group') public form: FormGroup;
  @Input() importError: string[];
  @Input() error: string | null;
  @Input() docs_repo: string;
  @Input() locale: string;
  @Input() csvFileCount: object = null;
  @Input() viewCount: boolean;
  @Output() countFileEmitter = new EventEmitter<{ file: any, save: boolean }>();
  @Output() stayHereEmitter = new EventEmitter<string>();

  constructor() {

  }

  ngOnInit() {
    if (this.csvFileCount !== null) {
      this.countFileEmitter.emit({ file: this.csvFileCount, save: false });
    }
  }

  ngOnChanges() {
    console.log("count: " + this.viewCount)

    if(!this.viewCount){
      
      if (this.csvFileCount !== null && (this.error !== null || this.importError.length > 0)) {
        this.deleteCsv();
      } else if (this.csvFileCount !== null) {
        this.countFileEmitter.emit({ file: this.csvFileCount, save: true });
      }
    }
  }

  handleUploadCsv(csvFile: any) {
    if (csvFile.target.files && csvFile.target.files.length > 0) {
      this.csvFileCount = csvFile.target.files[0];
      this.countFileEmitter.emit({ file: this.csvFileCount, save: false });
    }
  }

  getCsvUrl() {
    return this.docs_repo + "importCount-" + this.locale + ".csv";
  }

  deleteCsv() {
    let confirmRm = confirm('It will delete file : Count. Are you sure to continue?');
    if (confirmRm) {
      this.form.get('countInputFile').reset();
      this.countFileEmitter.emit({ file: null, save: true });
    } else {
      this.stayHereEmitter.emit('count');
    }
  }
}
