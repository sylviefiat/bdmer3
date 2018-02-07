import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite, getSitePageMsg } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    selector: 'bc-zone-import-page',
    template: `
    <bc-zone-import
      (upload)="handleUpload($event)"
      (err)="handleErrorUpload($event)"
      (back)="return($event)"
      [error]="error$ | async"
      [msg]="msg$ | async"
      [site]="site$ | async">
    </bc-zone-import>
  `,
  styles: [``]
})
export class ZoneImportPageComponent implements OnInit, OnDestroy {
    site$: Observable<Site>;
    error$: Observable<string | null>;
    msg$: Observable<string | null>;

    actionsSubscription: Subscription;
    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.actionsSubscription = route.params
            .map(params => new SiteAction.SelectSiteAction(params.idSite))
            .subscribe(store);
    }

    ngOnInit() {
        this.error$ = this.store.let(getSitePageError);
        this.msg$ = this.store.let(getSitePageMsg);
        this.site$ = this.store.let(getSelectedSite);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    handleUpload(csvFile: any): void {
        this.store.dispatch(new SiteAction.ImportZoneAction(csvFile));
    }

    handleErrorUpload(msg: string){
        this.store.dispatch(new SiteAction.AddSiteFailAction(msg));
    }

    return(code: string) {
        this.routerext.navigate(['/site'+code], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}