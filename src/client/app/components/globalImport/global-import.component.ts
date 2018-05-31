
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
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
    @Input() isAdmin: boolean;
    @Input() locale: boolean;
    @Input() docs_repo: string;
    @Output() pending = new EventEmitter<{ file: any, type: string }>(); 
    @Output() check = new EventEmitter<{ file: any, type: string }>();
    @Output() upload = new EventEmitter<{ file: any, type: string }>();

    csvFileSurvey$: Observable<any>;
    csvFileStation$: Observable<any>;
    csvFileCount$: Observable<any>;
    viewStation: boolean = true;
    viewSurvey: boolean;
    viewCount: boolean;

    stationForm: FormGroup = new FormGroup({
        stationInputFile: new FormControl(),
    });

    countForm: FormGroup = new FormGroup({
        countInputFile: new FormControl(),
    });

    surveyForm: FormGroup = new FormGroup({
        surveyInputFile: new FormControl(),
    });


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private router: Router) {
    }

    ngOnInit() {
        this.csvFileStation$ = of(null);
        this.csvFileSurvey$ = of(null);
        this.csvFileCount$ = of(null);
    }

    setStationFile(setFile) {
        this.csvFileStation$ = of(setFile.file);

        if (setFile.file !== null && !setFile.save) {
            this.check.emit({ file: setFile.file, type: 'station' });
        }else if(setFile.file !== null && setFile.save){
            this.pending.emit({ file: setFile.file, type: 'station' });
        }
    }

    setCountFile(setFile) {
        this.csvFileCount$ = of(setFile.file);

        if (setFile.file !== null) {
            this.check.emit({ file: setFile.file, type: 'count' });
        }else if(setFile.file !== null && setFile.save){
            this.check.emit({ file: setFile.file, type: 'count' });
        }
    }

    setSurveyFile(setFile) {
        this.csvFileSurvey$ = of(setFile.file);

        if (setFile.file !== null) {
            this.check.emit({ file: setFile.file, type: 'survey' });
        }else if(setFile.file !== null && setFile.save){
            this.check.emit({ file: setFile.file, type: 'survey' });
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
            case 0:{
                this.viewStation = true;
                break;
            }
            case 1:{
                this.viewSurvey = true;
                break;
            }
            case 2:{
                this.viewCount = true;
                break;
            }
        }

        switch (e.previouslySelectedIndex) {
            case 0:{
                this.viewStation = false;
                break;
            }
            case 1:{
                this.viewSurvey = false;
                break;
            }
            case 2:{
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
        this.csvFileStation$.subscribe(file => this.upload.emit({ file: file, type: 'station' }));
        this.csvFileSurvey$.subscribe(file => this.upload.emit({ file: file, type: 'survey' }));
        this.csvFileCount$.subscribe(file => this.upload.emit({ file: file, type: 'count' }));
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