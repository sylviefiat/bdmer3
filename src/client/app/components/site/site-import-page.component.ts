import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

import { IAppState, getSitePageError, getSelectedSite, getSitePageMsg, getAuthCountry } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-site-import-page',
    templateUrl: './site-import-page.component.html',
    styleUrls: [
        './site-import-page.component.css',
    ],
})
export class SiteImportPageComponent implements OnInit {
    error$: Observable<string | null>;
    userCountry$: Observable<Country>;
    actionsSubscription: Subscription;
    needHelp: boolean = false;
    private csvFile: string;
    private csvFileAdmin: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.store.take(1).subscribe((s: any) => {
            this.docs_repo = "../../../assets/docs/";
            this.csvFile = "importSite.csv";
            this.csvFileAdmin = "importSiteAdmin.csv";
        });
    }

    ngOnInit() {
        this.error$ = this.store.let(getSitePageError);
        
        this.userCountry$ = this.store.let(getAuthCountry);
    }

    handleUpload(csvFile: any): void {
        console.log(csvFile);
        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.store.dispatch(new SiteAction.ImportSiteAction(csvFile.target.files[0]));
        } else {
            this.store.dispatch(new SiteAction.AddSiteFailAction('No csv file found'));
        }
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getCsvSite() {
        return this.csvFile;
    }

    getCsvSitesUrl() {
        return this.docs_repo + this.csvFile;
    }

    getCsvSitesUrlAdmin(){
        return this.docs_repo + this.csvFileAdmin;
    }

    get isAdmin(){
        return this.userCountry$.map(user => user.code === "AA");
    }

    return() {
        this.routerext.navigate(['/site/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}