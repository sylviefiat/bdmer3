import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getisAdmin,getAllCountriesInApp, getLangues, getPlatformImpErrors, getPlatformImpMsg } from '../../modules/ngrx/index';
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
export class PlatformImportPageComponent implements OnInit {
    error$: Observable<string | null>;
    msg$: Observable<string | null>;
    importError$: Observable<string[]>;
    isAdmin$: Observable<boolean>;
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

    constructor(private platformService: PlatformService, private countryListService: CountryListService, private csv2JsonService: Csv2JsonService, private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
    }

    ngOnInit() {
        this.countries$ = this.store.let(getAllCountriesInApp);
        this.error$ = this.store.let(getPlatformPageError);
        this.importError$ = this.store.let(getPlatformImpErrors);
        this.msg$ = this.store.let(getPlatformImpMsg);
        this.isAdmin$ = this.store.let(getisAdmin);
        this.store.let(getLangues).subscribe((l: any) => {
            this.docs_repo = "../../../assets/files/";
            this.csvFile = "importPlatform-"+l+".csv";
            this.csvFileAdmin = "importPlatformAdmin-"+l+".csv";
        });
    }

    handleUpload(csvFile: any): void {
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.importCsvFile = csvFile.target.files["0"];
            this.check(this.importCsvFile);
        } else {
            this.store.dispatch(new PlatformAction.AddPlatformFailAction('No csv file found'));
        }
    }

    check(csvFile){
        this.isAdmin$
            .filter(isAdmin => isAdmin)
            .subscribe(isAdmin => this.store.dispatch(new PlatformAction.CheckPlatformCsvFile(csvFile)));
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    send(){
        this.store.dispatch(new PlatformAction.ImportPlatformAction(this.importCsvFile));
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