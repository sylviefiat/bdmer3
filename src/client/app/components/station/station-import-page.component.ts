import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform, Zone } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getSelectedZone } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    selector: 'bc-station-import-page',
    template: `
    <bc-station-import
      (upload)="handleUpload($event)"
      (err)="handleErrorUpload($event)"
      (back)="return($event)"
      [error]="error$ | async"
      [msg]="msg$ | async"
      [platform]="platform$ | async">
    </bc-station-import>
  `,
    styles: [``]
})
export class StationImportPageComponent implements OnInit, OnDestroy {
    platform$: Observable<Platform>;
    error$: Observable<string | null>;
    msg$: Observable<string | null>;


    platformSubscription: Subscription;
    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.platformSubscription = route.params.pipe(
            map(params => new PlatformAction.SelectPlatformAction(params.idPlatform)))
            .subscribe(store);
    }

    ngOnInit() {
        this.error$ = this.store.select(getPlatformPageError);
        this.msg$ = this.store.select(getPlatformPageMsg);
        this.platform$ = this.store.select(getSelectedPlatform);
    }

    ngOnDestroy() {
        this.platformSubscription.unsubscribe();
    }

    handleUpload(csvFile: any): void {
        this.store.dispatch(new PlatformAction.ImportStationAction(csvFile));
    }

    handleErrorUpload(msg: string) {
        this.store.dispatch(new PlatformAction.AddPlatformFailAction(msg));
    }

    return(event) {
        this.routerext.navigate(['/platform/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}