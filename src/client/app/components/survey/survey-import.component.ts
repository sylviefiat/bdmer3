import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import {TranslateService} from '@ngx-translate/core';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getLangues } from '../../modules/ngrx/index';
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

    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;

    constructor(private translate: TranslateService, private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
    }

    ngOnInit() {
        this.store.let(getLangues).subscribe((l: any) => {
            this.docs_repo = "../../../assets/files/";
            this.csvFile = "importSurvey-"+l+".csv";
        });
    }

    handleUpload(csvFile: any): void {
        let notFoundMsg = this.translate.instant('NO_CSV_FOUND');
        console.log(csvFile);
        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.upload.emit(csvFile.target.files[0]);
        } else {
            this.err.emit(notFoundMsg);
        }
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