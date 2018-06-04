import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
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
      [platform]="platform$ | async">
    </bc-zone-import>
  `,
  styles: [``]
})
export class ZoneImportPageComponent implements OnInit, OnDestroy {
    platform$: Observable<Platform>;
    error$: Observable<string | null>;
    msg$: Observable<string | null>;

    actionsSubscription: Subscription;
    needHelp: boolean = false;
    private kmlFile: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.actionsSubscription = route.params.pipe(
            map(params => new PlatformAction.SelectPlatformAction(params.idPlatform)))
            .subscribe(store);
    }

    ngOnInit() {
        this.error$ = this.store.select(getPlatformPageError);
        this.msg$ = this.store.select(getPlatformPageMsg);
        this.platform$ = this.store.select(getSelectedPlatform);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    handleUpload(kmlFile: any): void {
        this.store.dispatch(new PlatformAction.ImportZoneAction(kmlFile));
    }

    handleErrorUpload(msg: string){
        this.store.dispatch(new PlatformAction.AddPlatformFailAction(msg));
    }

    return(code: string) {
        this.routerext.navigate(['/platform'+code], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}