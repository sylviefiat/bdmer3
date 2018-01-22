import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site, Zone, Transect } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite, getSitePageMsg, getSelectedZone, getSelectedTransect } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    selector: 'bc-count-import-page',
    template: `
    <bc-count-import
      (upload)="handleUpload($event)"
      (err)="handleErrorUpload($event)"
      (back)="return($event)"
      [error]="error$ | async"
      [msg]="msg$ | async"
      [site]="site$ | async"
      [zone]="zone$ | async"
      [transect]="transect$ | async">
    </bc-count-import>
  `,
    styles: [``]
})
export class CountImportPageComponent implements OnInit, OnDestroy {
    site$: Observable<Site>;
    zone$: Observable<Zone>;
    transect$: Observable<Transect>;
    error$: Observable<string | null>;
    msg$: Observable<string | null>;


    siteSubscription: Subscription;
    zoneSubscription: Subscription;
    transectSubscription: Subscription;
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
        this.transectSubscription = route.params
            .map(params => new SiteAction.SelectTransectAction(params.idTransect))
            .subscribe(store);
    }

    ngOnInit() {
        this.error$ = this.store.let(getSitePageError);
        this.msg$ = this.store.let(getSitePageMsg);
        this.site$ = this.store.let(getSelectedSite);
        this.zone$ = this.store.let(getSelectedZone);
        this.transect$ = this.store.let(getSelectedTransect);
    }

    ngOnDestroy() {
        this.siteSubscription.unsubscribe();
        this.zoneSubscription.unsubscribe();
        this.transectSubscription.unsubscribe();
    }

    handleUpload(csvFile: any): void {
        console.log(csvFile);
        this.store.dispatch(new SiteAction.ImportCountAction(csvFile));
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