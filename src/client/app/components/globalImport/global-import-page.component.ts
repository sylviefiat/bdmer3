import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
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
    templateUrl: './global-import-page.component.html',
    styleUrls: [
    './global-import-page.component.css',
    ],
    styles: [
    '.mat-horizontal-stepper-header-container{pointer-events: none!important;}'
    ]
})
export class GlobalImportPageComponent implements OnInit {
    @ViewChild('stepper') stepper: MatStepper;

    platform: object;
    error$: Observable<string | null>;
    importError$: Observable<string[]>;
    isAdmin$: Observable<Country>;
    locale$: Observable<boolean>;
    actionsSubscription: Subscription;
    needHelp: boolean = false;
    private docs_repo: string;
    language: string;
    csvFileSurvey: object = null;
    csvFileSurveyPending: boolean = false;
    csvFileZonePref: object = null;
    csvFileTransect: object = null;
    csvFileTransectPending: boolean = false;
    csvFileCount: object = null;
    kmlFileZones: object = null;
    kmlFileZonesPending: boolean = false;
    next: boolean = false;
    fromto = { from: 'zone', to: null };

    inputForm: FormGroup = new FormGroup({
        zoneInputFile: new FormControl(),
        zonePrefInputFile: new FormControl(),
        transectInputFile: new FormControl(),
        surveyInputFile: new FormControl(),
        countInputFile: new FormControl()
    });


    constructor(private geojsonService: GeojsonService, private mapStaticService: MapStaticService, private nameRefactorService: NameRefactorService, private store: Store<IAppState>, public routerext: RouterExtensions, private router: Router) {
    }

    ngOnInit() {
        this.store.let(getSelectedPlatform).subscribe((platform) => {
            this.platform = platform;
        });

        this.importError$ = this.store.let(getPlatformImpErrors);
        this.error$ = this.store.let(getPlatformPageError);
        this.isAdmin$ = this.store.let(getisAdmin);
        this.store.dispatch(new SpeciesAction.LoadAction())
        this.store.let(getLangues).subscribe((l: any) => {
            this.language = l;
            this.docs_repo = "../../../assets/files/";
        });
    }

    selectIndex(i){
        setTimeout(()=>{
            this.stepper.selectedIndex = i; 
        },0);
    }

    handleUploadKml(kmlFile: any): void {
        let kml = kmlFile;
        if (kmlFile.target.files && kmlFile.target.files.length > 0) {

            if (this.kmlFileZonesPending) {

                let stringTab = [];
                let string = "It will delete file(s) : ";


                if (this.csvFileZonePref !== null)
                    stringTab.push("zonePref")

                if (this.csvFileCount !== null)
                    stringTab.push("count")

                if (this.csvFileTransect !== null)
                    stringTab.push("transect")


                for (let i in stringTab) {
                    if (parseInt(i) === stringTab.length - 1) {
                        string += (stringTab[i] + ".")
                    } else {
                        string += (stringTab[i] + ", ")
                    }
                }

                if (stringTab.length !== 0) {
                    let r = confirm(string + ' Are you sure to continue?');

                    if (r) {
                        this.clearFile(stringTab, true);
                    }
                }

                this.clearFile(["zone"], false);
            }

            this.kmlFileZones = kml.target.files['0'];
        }
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
                case "transect": {
                    if (this.csvFileTransectPending) {
                        if (this.csvFileCount !== null) {
                            let confirmTransect = confirm('It will delete file : Count. Are you sure to continue?');
                            if (confirmTransect) {
                                this.clearFile(["count"], true);
                                this.clearFile(["transect"], false);
                            }
                        } else {
                            this.clearFile(["transect"], true);
                        }
                    }
                    this.csvFileTransect = csvFile.target.files["0"];
                    this.store.dispatch(new PlatformAction.CheckTransectCsvFile(this.csvFileTransect));
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
                case "zone": {
                    if (this.kmlFileZonesPending) {
                        this.store.dispatch(new PlatformAction.RemovePendingZoneAction(this.kmlFileZones));
                        this.kmlFileZonesPending = false;
                    }
                    this.store.dispatch(new PlatformAction.RemoveMsgAction())
                    if (reset) {
                        this.inputForm.get('zoneInputFile').reset();
                        this.kmlFileZones = null;
                    }
                    break;
                }
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
                case "transect": {
                    if (this.csvFileTransectPending) {
                        this.store.dispatch(new PlatformAction.RemovePendingTransectAction(this.csvFileTransect));
                        this.csvFileTransectPending = false;
                    }
                    this.store.dispatch(new PlatformAction.RemoveMsgAction())
                    if (reset) {
                        console.log("reset transect");
                        this.inputForm.get('transectInputFile').reset();
                        this.csvFileTransect = null;
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
                    this.selectIndex(1);
                }
                break;
            }
            case "transect": {
                if (this.csvFileCount !== null) {
                    let confirmTransect = confirm('It will delete file : Transect, Count. Are you sure to continue?');
                    if (confirmTransect) {
                        this.clearFile(["count", "transect"], true);
                    }else{
                        this.selectIndex(2);
                    }
                } else {
                    let confirmSurvey = confirm('It will delete file : Transect. Are you sure to continue?');
                    if (confirmSurvey) {
                        this.clearFile(["transect"], true);
                    }else{
                        this.selectIndex(2);
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
                        this.selectIndex(3);
                    }
                } else {
                    let confirmSurvey = confirm('It will delete file : Survey. Are you sure to continue?');
                    if (confirmSurvey) {
                        this.clearFile(["survey"], true);
                    }else{
                        this.selectIndex(3);
                    }
                }
                break;
            }
            case "count": {
                let confirmCount = confirm('It will delete file : Count. Are you sure to continue?');
                if (confirmCount) {
                    this.clearFile(["count"], true);
                }else{
                    this.selectIndex(4);
                }
                break;
            }
        }
    }

    changeIndex(e) {
        switch (e.selectedIndex) {
            case 0: {
                this.fromto.to = "zone"
                break;
            }
            case 1: {
                this.fromto.to = "zonePref"
                if (this.csvFileZonePref !== null) {
                    this.store.dispatch(new PlatformAction.CheckZonePrefCsvFile(this.csvFileZonePref));
                }
                break;
            }
            case 2: {
                this.fromto.to = "transect"
                if (this.csvFileTransect !== null) {
                    this.store.dispatch(new PlatformAction.CheckTransectCsvFile(this.csvFileTransect));
                }
                break;
            }
            case 3: {
                this.fromto.to = "survey"
                if (this.csvFileSurvey !== null) {
                    this.store.dispatch(new PlatformAction.CheckSurveyCsvFile(this.csvFileSurvey));
                }
                break;
            }
            case 4: {
                this.fromto.to = "count"
                if (this.csvFileCount !== null) {
                    this.store.dispatch(new PlatformAction.CheckCountCsvFile(this.csvFileCount));
                }
                break;
            }
        }

        switch (e.previouslySelectedIndex) {
            case 0: {
                this.fromto.from = "zone";
                if (this.kmlFileZones !== null && !this.kmlFileZonesPending) {
                    console.log("pending zone");
                    this.kmlFileZonesPending = true;
                    this.store.dispatch(new PlatformAction.AddPendingZoneAction(this.kmlFileZones));
                }
                break;
            }
            case 1: {
                this.fromto.from = "zonePref";
                this.error$.first().subscribe(e =>{
                    this.importError$.first().subscribe(ie => {
                        if (this.csvFileZonePref !== null && (e !== null || ie.length > 0)) {
                            this.deleteCsv('zonePref');
                        }
                    })
                });
                break;
            }
            case 2: {
                this.fromto.from = "transect";
                this.error$.first().subscribe(e =>{
                    this.importError$.first().subscribe(ie => {
                        if (this.csvFileTransect !== null && (e !== null || ie.length > 0)) {
                            this.deleteCsv('transect');
                        }else if(this.csvFileTransect !== null && !this.csvFileTransectPending){
                            console.log("pending transect");
                            this.csvFileTransectPending = true;
                            this.store.dispatch(new PlatformAction.AddPendingTransectAction(this.csvFileTransect));
                        }
                    })
                });
                break;
            }
            case 3: {
                this.fromto.from = "survey";
                this.error$.first().subscribe(e =>{
                    this.importError$.first().subscribe(ie => {
                        if (this.csvFileSurvey !== null && (e !== null || ie.length > 0)) {
                            this.deleteCsv('survey');
                        }else if (this.csvFileSurvey !== null && !this.csvFileSurveyPending) {
                            console.log("pending survey");
                            this.csvFileSurveyPending = true;
                            this.store.dispatch(new PlatformAction.AddPendingSurveyAction(this.csvFileSurvey));
                        }
                    })
                });
                break;
            }
            case 4: {
                this.fromto.from = "count";
                this.error$.first().subscribe(e =>{
                    this.importError$.first().subscribe(ie => {
                        if (this.csvFileCount !== null && (e !== null || ie.length > 0)) {
                            this.deleteCsv('count');
                        }
                    })
                });
                break;
            }
        }

        this.store.dispatch(new PlatformAction.RemoveMsgAction())
    }

    deleteKml() {
        let stringTab = [];
        let string = "It will delete file(s) : ";


        if (this.csvFileZonePref !== null)
            stringTab.push("zonePref")

        if (this.csvFileCount !== null)
            stringTab.push("count")

        if (this.csvFileTransect !== null)
            stringTab.push("transect")

        if (this.kmlFileZones !== null)
            stringTab.push("zone")

        for (let i in stringTab) {
            if (parseInt(i) === stringTab.length - 1) {
                string += (stringTab[i] + ".")
            } else {
                string += (stringTab[i] + ", ")
            }
        }
        let r = confirm(string + ' Are you sure to continue?');

        if (r) {
            this.clearFile(stringTab, true);
        }
    }

    send() {
        if (this.kmlFileZones !== null)
            this.geojsonService.kmlToGeoJson(this.kmlFileZones, this.platform).then((zone) =>{
                for(let i in zone){
                    this.store.dispatch(new PlatformAction.ImportZoneAction(zone[i]))
                }
            })

        if (this.csvFileTransect !== null)
            this.store.dispatch(new PlatformAction.ImportTransectAction(this.csvFileTransect));

        if (this.csvFileSurvey !== null)
            this.store.dispatch(new PlatformAction.ImportSurveyAction(this.csvFileSurvey));
        
        if (this.csvFileZonePref !== null)
            this.store.dispatch(new PlatformAction.ImportZonePrefAction(this.csvFileZonePref));

        if (this.csvFileCount !== null)
            this.store.dispatch(new PlatformAction.ImportCountAction(this.csvFileCount));
        
        this.return();
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getCsvUrl(type) {
        return this.docs_repo + "import" + type + "-" + this.language + ".csv"
    }

    getKmlUrl(type) {
        return this.docs_repo + "import" + type + "-" + this.language + ".kml"
    }

    return() {
        this.routerext.navigate(['/platform/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

    ngOnDestroy() {
        //this.store.dispatch(new PlatformAction.ResetAllPendingAction());
    }
}