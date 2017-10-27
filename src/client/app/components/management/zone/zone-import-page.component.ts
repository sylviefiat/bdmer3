import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../../modules/core/index';
import { Site } from '../../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite, getSitePageMsg } from '../../../modules/ngrx/index';
import { SiteAction } from '../../../modules/datas/actions/index';
import { CountriesAction } from '../../../modules/countries/actions/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-zone-import-page',
    templateUrl: './zone-import-page.component.html',
    styleUrls: [
        './zone-import-page.component.css',
    ],
})
export class ZoneImportPageComponent implements OnInit, OnDestroy {
    error$: Observable<string | null>;
    msg$: Observable<string | null>;
    actionsSubscription: Subscription;
    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.store.take(1).subscribe((s: any) => {
            this.docs_repo = "../../../assets/docs/";
            this.csvFile = "importZone.csv";
        });
    }

    ngOnInit() {
        this.error$ = this.store.let(getSitePageError);
        this.msg$ = this.store.let(getSitePageMsg);
    }

    ngOnDestroy() {

    }

    handleUpload(csvFile: any): void {
        console.log(csvFile);
        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.store.dispatch(new SiteAction.ImportZoneAction(csvFile.target.files[0]));
        } else {
            this.store.dispatch(new SiteAction.AddSiteFailAction('No csv file found'));
        }
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getCsvZone() {
        return this.csvFile;
    }

    getCsvZoneUrl() {
        return this.docs_repo + this.csvFile;
    }

    return() {
        this.routerext.navigate(['/management/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}