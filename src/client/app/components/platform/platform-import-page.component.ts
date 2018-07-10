import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

import { IAppState, getPlatformPageError, getSelectedPlatform, getAuthCountry, getPlatformPageMsg, getAllCountriesInApp, getLangues, getPlatformImpErrors, getPlatformImpMsg } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { Csv2JsonService } from '../../modules/core/services/csv2json.service';
import { CountryListService} from '../../modules/countries/services/country-list.service';
import { PlatformService } from '../../modules/datas/services/platform.service'

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-platform-import-page',
    templateUrl: './platform-import-page.component.html',
    styleUrls: [
    './platform-import-page.component.css',
    ],
})
export class PlatformImportPageComponent implements OnInit, OnDestroy {
    error$: Observable<string | null>;
    isAdmin$: Observable<Country>;
    msg$: Observable<string | null>;
    msg: string;
    importError$: Observable<string[]>;
    userCountry$: Observable<Country>
    locale$: Observable<boolean>;
    actionsSubscription: Subscription;
    needHelp: boolean = false;
    private csvFileAdmin: string;
    private docs_repo: string;
    countries$: Observable<Country[]>;
    platformsErr = [];
    error = true;
    csvFile: any;
    importCsvFile: any = null;
    platformForm: FormGroup = new FormGroup({
        platformInputFile: new FormControl(),
    });

    constructor(private translate: TranslateService, private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
      this.actionsSubscription = this.store.select(getLangues).subscribe((l: any) => {
        this.docs_repo = "../../../assets/files/";
            this.csvFile = "importPlatform-"+l+".csv";
            this.csvFileAdmin = "importPlatformAdmin-"+l+".csv";
        });
    }

    ngOnInit() {
        this.countries$ = this.store.select(getAllCountriesInApp);
        this.error$ = this.store.select(getPlatformPageError);
        this.importError$ = this.store.select(getPlatformImpErrors);
        this.msg$ = this.store.select(getPlatformImpMsg);
        this.userCountry$ = this.store.select(getAuthCountry);            
    }

    ngOnDestroy(){
        this.actionsSubscription.unsubscribe();
    }

    handleUpload(csvFile: any): void {
        let notFoundMsg = this.translate.instant('NO_CSV_FOUND');

        let reader = new FileReader();

        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.importCsvFile = csvFile.target.files["0"];
            this.check(this.importCsvFile);
        } else {
            this.store.dispatch(new PlatformAction.AddPlatformFailAction(notFoundMsg));
        }
    }

    check(csvFile){
        this.userCountry$
            .subscribe(userCountry =>{
              if(userCountry.code === 'AA'){
                  this.store.dispatch(new PlatformAction.CheckPlatformCsvFile(csvFile));
              }else{
                  this.msg = "Import can be performed"
              }
            });
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    send(){
        this.store.dispatch(new PlatformAction.ImportPlatformAction(this.importCsvFile));
    }

    clearInput(){
        this.platformForm.get('platformInputFile').reset();
    }

    getCsvPlatform() {
        return this.csvFile;
    }

    getCsvPlatformsUrl() {
        return this.docs_repo + this.csvFile;
    }

    getCsvPlatformsUrlAdmin(){
        return this.docs_repo + this.csvFileAdmin;
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