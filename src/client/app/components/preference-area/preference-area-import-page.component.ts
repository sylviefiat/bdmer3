import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform, Zone } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getSelectedZone } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
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
      [platform]="platform$ | async"
      [zone]="zone$ | async">
    </bc-zone-pref-import>
  `,
    styles: [``]
})
export class PreferenceAreaImportPageComponent implements OnInit, OnDestroy {
    platform$: Observable<Platform>;
    zone$: Observable<Zone>;
    error$: Observable<string | null>;
    msg$: Observable<string | null>;


    platformSubscription: Subscription;
    zoneSubscription: Subscription;
    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.platformSubscription = route.params
            .map(params => new PlatformAction.SelectPlatformAction(params.idPlatform))
            .subscribe(store);
        this.zoneSubscription = route.params
            .map(params => new PlatformAction.SelectZoneAction(params.idZone))
            .subscribe(store);
    }

    ngOnInit() {
        this.error$ = this.store.let(getPlatformPageError);
        this.msg$ = this.store.let(getPlatformPageMsg);
        this.platform$ = this.store.let(getSelectedPlatform);
        this.zone$ = this.store.let(getSelectedZone);
    }

    ngOnDestroy() {
        this.platformSubscription.unsubscribe();
        this.zoneSubscription.unsubscribe();
    }

    handleUpload(csvFile: any): void {
        this.store.dispatch(new PlatformAction.ImportZonePrefAction(csvFile));
    }

    handleErrorUpload(msg: string) {
        this.store.dispatch(new PlatformAction.AddPlatformFailAction(msg));
    }

    return(code: string) {
        this.store.dispatch(new PlatformAction.RemoveMsgAction());
        this.routerext.navigate(['/platform/'+code], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}