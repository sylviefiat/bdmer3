import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getisAdmin,getAllCountriesInApp, getLangues } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { Csv2JsonService } from '../../modules/core/services/csv2json.service';
import { CountryListService} from '../../modules/countries/services/country-list.service';

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
    isAdmin$: Observable<Country>;
    locale$: Observable<boolean>;
    actionsSubscription: Subscription;
    needHelp: boolean = false;
    private csvFile: string;
    private csvFileAdmin: string;
    private docs_repo: string;
    countries$: Observable<Country[]>;
    platformsErr = [];
    error = false;
    constructor(private countryListService: CountryListService, private csv2JsonService: Csv2JsonService, private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
    }

    ngOnInit() {
        this.countries$ = this.store.let(getAllCountriesInApp);
        this.error$ = this.store.let(getPlatformPageError);
        this.isAdmin$ = this.store.let(getisAdmin);
        this.store.let(getLangues).subscribe((l: any) => {
            this.docs_repo = "../../../assets/files/";
            this.csvFile = "importPlatform-"+l+".csv";
            this.csvFileAdmin = "importPlatformAdmin-"+l+".csv";
        });
    }

    handleUpload(csvFile: any): void {
        this.platformsErr = [];
        this.error = false;
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.isAdmin$.subscribe((isAdmin) =>{
                if(isAdmin){
                    this.countries$.subscribe((countries) =>{
                        this.csv2JsonService.csv2('platform', csvFile.target.files["0"]).subscribe((data) =>{
                            for(let i = 0; i < countries.length; i++){
                                if(data.codeCountry === countries[i].code){
                                    break;
                                } 
                                if(data.codeCountry !== countries[i].code && i === countries.length - 1){
                                    this.platformsErr.push(data)
                                }
                            }
                        })
                        if(this.platformsErr.length > 0){
                            this.error = true;
                        }
                    })
                }
            })
        } else {
            this.store.dispatch(new PlatformAction.AddPlatformFailAction('No csv file found'));
        }
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
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