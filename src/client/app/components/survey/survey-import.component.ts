import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformImpErrors, getPlatformPageMsg, getLangues } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-survey-import',
    templateUrl: './survey-import.component.html',
    styleUrls: [
        './survey-import.component.css',
    ],
})
export class SurveyImportComponent implements OnDestroy{
    @Input() platform: Platform;
    @Input() error: string | null;
    @Input() msg: string | null;
    @Output() upload = new EventEmitter<any>();
    @Output() err = new EventEmitter<string>();
    @Output() back = new EventEmitter();
    actionSubscription : Subscription;
    importError$: Observable<string[]>;
    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;
    importCsvFile: any = null;

    surveyForm: FormGroup = new FormGroup({
        surveyInputFile: new FormControl(),
    });

    constructor(private translate: TranslateService, private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
      this.actionSubscription = this.store.select(getLangues).subscribe((l: any) => {
        this.docs_repo = "../../../assets/files/";
            this.csvFile = "importSurvey-"+l+".csv";
        });
    }

    ngOnInit() {
        this.importError$ = this.store.select(getPlatformImpErrors);           
    }

    ngOnDestroy() {
        this.actionSubscription.unsubscribe();
    }

    handleUpload(csvFile: any): void {
        let notFoundMsg = this.translate.instant('NO_CSV_FOUND');
        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.importCsvFile = csvFile.target.files[0]; 
            this.check(this.importCsvFile);
        } else {
            this.err.emit(notFoundMsg);
        }
    }

    check(csvFile){
        this.store.dispatch(new PlatformAction.CheckSurveyCsvFile(csvFile));
    }

    send(){
        this.upload.emit(this.importCsvFile);
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getCsvSurveys() {
        return this.csvFile;
    }

    clearInput(){
        this.surveyForm.get('surveyInputFile').reset();
    }

    getCsvSurveysUrl() {
        return this.docs_repo + this.csvFile;
    }

    cancel() {
        this.back.emit();
    }
}