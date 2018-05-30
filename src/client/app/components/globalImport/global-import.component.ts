import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import * as togeojson from '@mapbox/togeojson';
import * as area from '@mapbox/geojson-area';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getisAdmin, getLangues, getPlatformImpErrors } from '../../modules/ngrx/index';
import { PlatformAction, SpeciesAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { NameRefactorService } from '../../modules/core/services/nameRefactor.service';
import { MapStaticService } from '../../modules/core/services/map-static.service';
import { GeojsonService } from '../../modules/core/services/geojson.service';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-global-import',
    templateUrl: './global-import.component.html',
    styleUrls: [
    './global-import.component.css',
    ],
    styles: [
    '.mat-horizontal-stepper-header-container{pointer-events: none!important;}'
    ]
})
export class GlobalImportComponent implements OnInit {
    @ViewChild('stepper') stepper: MatStepper;

    @Input() platform: Platform;
    @Input() error: string | null;
    @Input() importError: string[];
    @Input() isAdmin: Country;
    @Input() locale: boolean;
    @Input() docs_repo: string;
    @Output() upload = new EventEmitter<any>();
    needHelp: boolean = false;
    csvFileSurvey: object = null;
    csvFileSurveyPending: boolean = false;
    csvFileZonePref: object = null;
    csvFileStation: object = null;
    csvFileStationPending: boolean = false;
    csvFileCount: object = null;
    next: boolean = false;
    fromto = { from: 'zone', to: null };

    inputForm: FormGroup = new FormGroup({
        zoneInputFile: new FormControl(),
        zonePrefInputFile: new FormControl(),
        stationInputFile: new FormControl(),
        surveyInputFile: new FormControl(),
        countInputFile: new FormControl()
    });


    constructor(private geojsonService: GeojsonService, private mapStaticService: MapStaticService, private nameRefactorService: NameRefactorService, private store: Store<IAppState>, public routerext: RouterExtensions, private router: Router) {
    }

    ngOnInit() {
    }

    selectIndex(i){
        setTimeout(()=>{
            this.stepper.selectedIndex = i; 
        },0);
    }


    handleUploadCsv(csvFile: any, type: string): void {
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            switch (type) {
                case "survey": {
                    if (this.csvFileSurveyPending) {
                        if (this.csvFileCount !== null) {
                            let confirmSurvey = confirm('It will delete file : Count. Are you sure to continue?');
                            if (confirmSurvey) {
                                this.clearFile(["count"], true);
                                this.clearFile(["survey"], false);
                            }
                        } else {
                            this.clearFile(["survey"], false);
                        }
                    }
                    this.csvFileSurvey = csvFile.target.files["0"];
                    this.store.dispatch(new PlatformAction.CheckSurveyCsvFile(this.csvFileSurvey));
                    break;
                }
                case "zonePref": {
                    this.csvFileZonePref = csvFile.target.files["0"];
                    this.store.dispatch(new PlatformAction.CheckZonePrefCsvFile(this.csvFileZonePref));
                    break;
                }
                case "station": {
                    if (this.csvFileStationPending) {
                        if (this.csvFileCount !== null) {
                            let confirmStation = confirm('It will delete file : Count. Are you sure to continue?');
                            if (confirmStation) {
                                this.clearFile(["count"], true);
                                this.clearFile(["station"], false);
                            }
                        } else {
                            this.clearFile(["station"], true);
                        }
                    }
                    this.csvFileStation = csvFile.target.files["0"];
                    this.store.dispatch(new PlatformAction.CheckStationCsvFile(this.csvFileStation));
                    break;
                }
                case "count": {
                    this.csvFileCount = csvFile.target.files["0"];
                    this.store.dispatch(new PlatformAction.CheckCountCsvFile(this.csvFileCount));
                    break;
                }
            }
        } else {
            this.store.dispatch(new PlatformAction.AddPlatformFailAction('No csv file found'));
        }
    }

    clearFile(types, reset: boolean) {
        for (let i in types) {
            switch (types[i]) {
                case "survey": {
                    if (this.csvFileSurveyPending) {
                        this.store.dispatch(new PlatformAction.RemovePendingSurveyAction(this.csvFileSurvey));
                        this.csvFileSurveyPending = false;
                    }
                    this.store.dispatch(new PlatformAction.RemoveMsgAction())
                    if (reset) {
                        this.csvFileSurvey = null;
                        this.inputForm.get('surveyInputFile').reset();
                    }
                    break;
                }
                case "zonePref": {
                    this.store.dispatch(new PlatformAction.RemoveMsgAction())
                    if (reset) {
                        this.csvFileZonePref = null;
                        this.inputForm.get('zonePrefInputFile').reset();
                    }
                    break;
                }
                case "station": {
                    if (this.csvFileStationPending) {
                        this.store.dispatch(new PlatformAction.RemovePendingStationAction(this.csvFileStation));
                        this.csvFileStationPending = false;
                    }
                    this.store.dispatch(new PlatformAction.RemoveMsgAction())
                    if (reset) {
                        console.log("reset station");
                        this.inputForm.get('stationInputFile').reset();
                        this.csvFileStation = null;
                    }
                    break;
                }
                case "count": {
                    this.store.dispatch(new PlatformAction.RemoveMsgAction())
                    if (reset) {
                        this.csvFileCount = null;
                        this.inputForm.get('countInputFile').reset();
                    }
                    break;
                }
            }
        }
    }

    deleteCsv(type: string) {
        switch (type) {
            case "zonePref": {
                let confirmZonePref = confirm('It will delete file : Zone Pref. Are you sure to continue?');
                if (confirmZonePref) {
                    this.clearFile(["zonePref"], true);
                }else{
                    this.selectIndex(0);
                }
                break;
            }
            case "station": {
                if (this.csvFileCount !== null) {
                    let confirmStation = confirm('It will delete file : Station, Count. Are you sure to continue?');
                    if (confirmStation) {
                        this.clearFile(["count", "station"], true);
                    }else{
                        this.selectIndex(1);
                    }
                } else {
                    let confirmSurvey = confirm('It will delete file : Station. Are you sure to continue?');
                    if (confirmSurvey) {
                        this.clearFile(["station"], true);
                    }else{
                        this.selectIndex(1);
                    }
                }
                break;
            }
            case "survey": {
                if (this.csvFileCount !== null) {
                    let confirmSurvey = confirm('It will delete file : Survey, Count. Are you sure to continue?');
                    if (confirmSurvey) {
                        this.clearFile(["count", "survey"], true);
                    }else{
                        this.selectIndex(2);
                    }
                } else {
                    let confirmSurvey = confirm('It will delete file : Survey. Are you sure to continue?');
                    if (confirmSurvey) {
                        this.clearFile(["survey"], true);
                    }else{
                        this.selectIndex(2);
                    }
                }
                break;
            }
            case "count": {
                let confirmCount = confirm('It will delete file : Count. Are you sure to continue?');
                if (confirmCount) {
                    this.clearFile(["count"], true);
                }else{
                    this.selectIndex(3);
                }
                break;
            }
        }
    }

    changeIndex(e) {
        switch (e.selectedIndex) {
            case 0: {
                this.fromto.to = "zonePref"
                if (this.csvFileZonePref !== null) {
                    this.store.dispatch(new PlatformAction.CheckZonePrefCsvFile(this.csvFileZonePref));
                }
                break;
            }
            case 1: {
                this.fromto.to = "station"
                if (this.csvFileStation !== null) {
                    this.store.dispatch(new PlatformAction.CheckStationCsvFile(this.csvFileStation));
                }
                break;
            }
            case 2: {
                this.fromto.to = "survey"
                if (this.csvFileSurvey !== null) {
                    this.store.dispatch(new PlatformAction.CheckSurveyCsvFile(this.csvFileSurvey));
                }
                break;
            }
            case 3: {
                this.fromto.to = "count"
                if (this.csvFileCount !== null) {
                    this.store.dispatch(new PlatformAction.CheckCountCsvFile(this.csvFileCount));
                }
                break;
            }
        }

        switch (e.previouslySelectedIndex) {
            case 0: {
                this.fromto.from = "zonePref";
                if (this.csvFileZonePref !== null && (this.error !== null || this.importError.length > 0)) {
                    this.deleteCsv('zonePref');
                }
                break;
            }
            case 1: {
                this.fromto.from = "station";
                if (this.csvFileStation !== null && (this.error !== null || this.importError.length > 0)) {
                    this.deleteCsv('station');
                } else if(this.csvFileStation !== null && !this.csvFileStationPending){
                            console.log("pending Station");
                            this.csvFileStationPending = true;
                            this.store.dispatch(new PlatformAction.AddPendingStationAction(this.csvFileStation));
                }
                break;
            }
            case 2: {
                this.fromto.from = "survey";
                if (this.csvFileSurvey !== null && (this.error !== null || this.importError.length > 0)) {
                    this.deleteCsv('survey');
                } else if (this.csvFileSurvey !== null && !this.csvFileSurveyPending) {
                            console.log("pending survey");
                            this.csvFileSurveyPending = true;
                            this.store.dispatch(new PlatformAction.AddPendingSurveyAction(this.csvFileSurvey));
                }
                break;
            }
            case 3: {
                this.fromto.from = "count";
                if (this.csvFileCount !== null && (this.error !== null || this.importError.length > 0)) {
                    this.deleteCsv('count');
                }
                break;
            }
        }

        this.store.dispatch(new PlatformAction.RemoveMsgAction())
    }

    send() {        
        this.upload.emit([{type: 'survey', file: this.csvFileSurvey}, {type: 'station', file: this.csvFileStation}, {type: 'zonePref', file: this.csvFileZonePref}, {type: 'count', file: this.csvFileCount}]);
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getCsvUrl(type) {
        return this.docs_repo + "import" + type + "-" + this.locale + ".csv";
    }

    return() {
        this.routerext.navigate(['/platform/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}