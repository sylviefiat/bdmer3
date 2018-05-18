import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

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
export class SurveyImportComponent implements OnInit{
    @Input() platform: Platform;
    @Input() error: string | null;
    @Input() msg: string | null;
    @Output() upload = new EventEmitter<any>();
    @Output() err = new EventEmitter<string>();
    @Output() back = new EventEmitter();

    importError$: Observable<string[]>;
    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;
    importCsvFile: any = null;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
    }

    ngOnInit() {
        this.importError$ = this.store.let(getPlatformImpErrors);
        this.store.let(getLangues).subscribe((l: any) => {
            this.docs_repo = "../../../assets/files/";
            this.csvFile = "importSurvey-"+l+".csv";
        });
    }

    handleUpload(csvFile: any): void {
        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.importCsvFile = csvFile.target.files[0]; 
            this.check(this.importCsvFile);
        } else {
            this.err.emit('No csv file found');
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

    getCsvSurveysUrl() {
        return this.docs_repo + this.csvFile;
    }

    cancel() {
        this.back.emit();
    }
}