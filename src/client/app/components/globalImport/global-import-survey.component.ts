import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'bc-global-import-survey',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div [formGroup]="form">
  <mat-card class="no-box-shadow">
  <mat-card-title-group>
  <mat-card-title>{{'IMPORT_CSV' | translate }} Surveys</mat-card-title> 
  <fa mat-card-sm-image [name]="'upload'" [border]=true [size]=2></fa> 
  </mat-card-title-group>
  <mat-card-content>
  {{'IMPORT_DESC' | translate }}    
  </mat-card-content>
  <mat-card-content class="warn">
  {{'IMPORT_DESC_DATE' | translate }}      
  </mat-card-content>
  <mat-card-footer class="footer">
  <h5 mat-subheader>{{ 'DOWNLOAD_CSV_SURVEYS' | translate }}</h5>
  <a *ngIf="!isAdmin" href="{{getCsvUrl()}}" download>
  <fa [name]="'download'" [border]=true [size]=1></fa>
  </a>
  </mat-card-footer>
  <mat-card-actions align="start">
  <button (click)="fileInputSurvey.click(); clearInput()">
  <span>{{ 'IMPORT_CSV' | translate }}</span>
  <input #fileInputSurvey type="file" (change)="handleUploadCsv($event)" formControlName="surveyInputFile" style="display:none;"  accept=".csv"/>
  </button>

  <button class="btn-danger" *ngIf="csvFileSurvey" (click)="deleteCsv('survey')">
  <span>{{ 'DELETE_CSV' | translate }}</span>
  </button>
  <div *ngIf="csvFileSurvey">
  {{csvFileSurvey.name}} {{ 'SELECTED_CSV' | translate }}
  </div>
  </mat-card-actions>
  <mat-card-content class="error" *ngIf="(error$ | async) !== null" align="center">{{ 'ERROR_CSV_FIELD' | translate }} {{ error$ | async }}</mat-card-content>
  <mat-card-content class="msg" *ngIf="(importError$ | async)?.length === 0 && csvFileSurvey !== null && (error$ | async) === null" align="start">{{ 'VALID_DATA' | translate }}</mat-card-content>

  <mat-card-actions align="start" *ngIf="(importError$ | async)?.length > 0">
  <h2 class="errorList">{{'LIST_ERROR_SURVEY' | translate}}</h2>
  <mat-list>
  <div *ngFor="let survey of (importError$ | async)">
  <mat-list-item class="errorList"> 
  {{survey}}
  </mat-list-item>
  </div>
  </mat-list>
  </mat-card-actions>
  </mat-card>
  </div>
  `,
})
export class GlobalImportSurveyComponent implements OnInit, OnChanges, OnDestroy{
  @Input('group') public form: FormGroup;
  @Input() importError$: Observable<string[]>;
  @Input() error$: Observable<string | null>;
  @Input() docs_repo: string;
  @Input() locale: string;
  @Input() csvFileSurvey: object = null;
  @Input() csvFileCount: object = null;
  @Input() viewSurvey: boolean;
  @Output() surveyFileEmitter = new EventEmitter<{ file: any, action: string }>();
  @Output() countFileEmitter = new EventEmitter<{ file: any, action: string }>();
  @Output() stayHereEmitter = new EventEmitter<string>();

  view: boolean = false;
  hasErr: boolean;
  hasIErr: boolean;
  hasErrSub: Subscription;
  hasIErrSub: Subscription;

  constructor() {

  }

  ngOnInit() {
    this.hasErrSub = this.error$.subscribe(err => {
      this.hasErr = (err!==null);
    });
    this.hasIErrSub = this.importError$.subscribe(ie => {
      this.hasIErr = (ie.length > 0);
    })
  }

  ngOnChanges() {
    if(!this.viewSurvey && this.view){
      if (this.csvFileSurvey !== null && (this.hasErr || this.hasIErr)) {
        this.deleteCsv();
      } else if (this.csvFileSurvey !== null) {
        this.surveyFileEmitter.emit({ file: this.csvFileSurvey, action: "save" });
      }
    }

    this.view = this.viewSurvey;
  }

  clearInput(){
    this.form.get('surveyInputFile').reset();
  }

  handleUploadCsv(csvFile: any) {
    let confirmRm;

    if (csvFile.target.files && csvFile.target.files.length > 0) {
      if (this.csvFileCount !== null) {
        confirmRm = confirm('It will delete file : Count. Are you sure to continue?');
      }else{
        this.csvFileSurvey = csvFile.target.files[0];
        this.surveyFileEmitter.emit({ file: this.csvFileSurvey, action: "check" });
      }

      if(confirmRm){
        this.countFileEmitter.emit({ file: null, action: "delete" });
        this.csvFileSurvey = csvFile.target.files[0];
        this.surveyFileEmitter.emit({ file: this.csvFileSurvey, action: "check" });
      }
    }
  }

  getCsvUrl() {
    return this.docs_repo + "importSurvey-" + this.locale + ".csv";
  }

  ngOnDestroy(){
    this.hasErrSub.unsubscribe();
    this.hasIErrSub.unsubscribe();
  }

  deleteCsv() {
    let confirmRm;
    if (this.csvFileCount !== null) {
      confirmRm = confirm('It will delete file : Survey, Count. Are you sure to continue?');
    } else {
      confirmRm = confirm('It will delete file : Survey. Are you sure to continue?');
    }
    if (confirmRm) {
      this.surveyFileEmitter.emit({ file: this.csvFileSurvey, action: "delete" });
      this.countFileEmitter.emit({ file: null, action: "delete" });
      this.form.get('surveyInputFile').reset();
    } else {
      this.stayHereEmitter.emit('survey');
    }
  }
}
