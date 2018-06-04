import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import {TranslateService} from '@ngx-translate/core';

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
export class PlatformImportPageComponent implements OnInit {
    error$: Observable<string | null>;
    isAdmin$: Observable<Country>;
    locale$: Observable<boolean>;
    actionsSubscription: Subscription;
    needHelp: boolean = false;
    private csvFile: string;
    private csvFileAdmin: string;
    private docs_repo: string;

    constructor(private translate: TranslateService, private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
    }

    ngOnInit() {
        this.error$ = this.store.let(getPlatformPageError);
        this.isAdmin$ = this.store.let(getisAdmin);
        this.store.let(getLangues).subscribe((l: any) => {
            this.docs_repo = "../../../assets/files/";
            this.csvFile = "importPlatform-"+l+".csv";
            this.csvFileAdmin = "importPlatformAdmin-"+l+".csv";
        });
    }

    handleUpload(csvFile: any): void {
        let notFoundMsg = this.translate.instant('NO_CSV_FOUND');

        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.store.dispatch(new PlatformAction.ImportPlatformAction(csvFile.target.files[0]));
        } else {
            this.store.dispatch(new PlatformAction.AddPlatformFailAction(notFoundMsg));
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