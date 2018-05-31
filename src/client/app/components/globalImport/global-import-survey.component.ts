import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

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
  <a *ngIf="!isAdmin" href="{{getCsvUrl('Survey')}}" download>
  <fa [name]="'download'" [border]=true [size]=1></fa>
  </a>
  </mat-card-footer>
  <mat-card-actions align="start">
  <button (click)="fileInputSurvey.click()">
  <span>{{ 'IMPORT_CSV' | translate }}</span>
  <input #fileInputSurvey type="file" (change)="handleUploadCsv($event, 'survey')" formControlName="surveyInputFile" style="display:none;"  accept=".csv"/>
  </button>

  <button class="btn-danger" *ngIf="csvFileSurvey" (click)="deleteCsv('survey')">
  <span>{{ 'DELETE_CSV' | translate }}</span>
  </button>
  <div *ngIf="csvFileSurvey">
  {{csvFileSurvey.name}} {{ 'SELECTED_CSV' | translate }}
  </div>
  </mat-card-actions>
  <mat-card-content class="error" *ngIf="error  !== null" align="center">{{ 'ERROR_CSV_FIELD' | translate }} {{ error }}</mat-card-content>
  <mat-card-content class="msg" *ngIf="importError.length === 0 && csvFileSurvey !== null && error === null" align="start">{{ 'VALID_DATA' | translate }}</mat-card-content>

  <mat-card-actions align="start" *ngIf="importError.length > 0">
  <h2 class="errorList">{{'LIST_ERROR_SURVEY' | translate}}</h2>
  <mat-list>
  <div *ngFor="let survey of importError">
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
export class GlobalImportSurveyComponent implements OnInit, OnChanges {
  @Input('group') public form: FormGroup;
  @Input() importError: string[];
  @Input() error: string | null;
  @Input() docs_repo: string;
  @Input() locale: string;
  @Input() csvFileSurvey: object = null;
  @Input() csvFileCount: object = null;
  @Input() viewSurvey: boolean;
  @Output() surveyFileEmitter = new EventEmitter<{ file: any, save: boolean }>();
  @Output() countFileEmitter = new EventEmitter<{ file: any, save: boolean }>();
  @Output() stayHereEmitter = new EventEmitter<string>();

  constructor() {

  }

  ngOnInit() {
    if (this.csvFileSurvey !== null) {
      this.surveyFileEmitter.emit({ file: this.csvFileSurvey, save: false });
    }
  }

  ngOnChanges() {

    console.log("survey: " + this.viewSurvey)
    if(!this.viewSurvey){
      if (this.csvFileSurvey !== null && (this.error !== null || this.importError.length > 0)) {
        this.deleteCsv();
      } else if (this.csvFileSurvey !== null) {
        this.surveyFileEmitter.emit({ file: this.csvFileSurvey, save: true });
      }
    }
  }

  handleUploadCsv(csvFile: any) {
    if (csvFile.target.files && csvFile.target.files.length > 0) {
      this.csvFileSurvey = csvFile.target.files[0];
      this.surveyFileEmitter.emit({ file: this.csvFileSurvey, save: false });
    }
  }

  getCsvUrl() {
    return this.docs_repo + "importSurvey-" + this.locale + ".csv";
  }

  deleteCsv() {
    let confirmRm;
    if (this.csvFileCount !== null) {
      confirmRm = confirm('It will delete file : Survey, Count. Are you sure to continue?');
    } else {
      confirmRm = confirm('It will delete file : Survey. Are you sure to continue?');
    }
    if (confirmRm) {
      this.form.get('surveyInputFile').reset();
      this.surveyFileEmitter.emit({ file: null, save: true });
      this.countFileEmitter.emit({ file: null, save: true });
    } else {
      this.stayHereEmitter.emit('survey');
    }
  }
}
