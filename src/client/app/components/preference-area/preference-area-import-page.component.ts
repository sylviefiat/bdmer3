import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site, Zone } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite, getSitePageMsg, getSelectedZone } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    selector: 'bc-zone-pref-import-page',
    template: `
    <bc-zone-pref-import
      (upload)="handleUpload($event)"
      (err)="handleErrorUpload($event)"
      (back)="return($event)"
      [error]="error$ | async"
      [msg]="msg$ | async"
      [site]="site$ | async"
      [zone]="zone$ | async">
    </bc-zone-pref-import>
  `,
    styles: [``]
})
export class PreferenceAreaImportPageComponent implements OnInit, OnDestroy {
    site$: Observable<Site>;
    zone$: Observable<Zone>;
    error$: Observable<string | null>;
    msg$: Observable<string | null>;


    siteSubscription: Subscription;
    zoneSubscription: Subscription;
    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.siteSubscription = route.params
            .map(params => new SiteAction.SelectSiteAction(params.idSite))
            .subscribe(store);
        this.zoneSubscription = route.params
            .map(params => new SiteAction.SelectZoneAction(params.idZone))
            .subscribe(store);
    }

    ngOnInit() {
        this.error$ = this.store.let(getSitePageError);
        this.msg$ = this.store.let(getSitePageMsg);
        this.site$ = this.store.let(getSelectedSite);
        this.zone$ = this.store.let(getSelectedZone);
    }

    ngOnDestroy() {
        this.siteSubscription.unsubscribe();
        this.zoneSubscription.unsubscribe();
    }

    handleUpload(csvFile: any): void {
        console.log(csvFile);
        this.store.dispatch(new SiteAction.ImportZonePrefAction(csvFile));
    }

    handleErrorUpload(msg: string) {
        this.store.dispatch(new SiteAction.AddSiteFailAction(msg));
    }

    return(event) {
        this.routerext.navigate(['/site/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}