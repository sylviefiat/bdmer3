import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getisAdmin, getLangues } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

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
    actionsSubscription: Subscription;
    needHelp: boolean = false;
    private csvFile: string;
    private csvFileAdmin: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.actionsSubscription = this.store.select(getLangues).subscribe((l: any) => {
            this.docs_repo = "../../../assets/files/";
            this.csvFile = "importPlatform-"+l+".csv";
            this.csvFileAdmin = "importPlatformAdmin-"+l+".csv";
        });
    }

    ngOnInit() {
        this.error$ = this.store.select(getPlatformPageError);
        this.isAdmin$ = this.store.select(getisAdmin);        
    }

    ngOnDestroy(){
        this.actionsSubscription.unsubscribe();
    }

    handleUpload(csvFile: any): void {
        console.log(csvFile);
        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.store.dispatch(new PlatformAction.ImportPlatformAction(csvFile.target.files[0]));
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