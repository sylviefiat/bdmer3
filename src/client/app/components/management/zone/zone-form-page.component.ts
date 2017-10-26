import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../../modules/core/index';
import { Site, Zone } from '../../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedZone } from '../../../modules/ngrx/index';
import { SiteAction } from '../../../modules/datas/actions/index';

@Component({
    selector: 'bc-zone-page',
    template: `
    <md-card>
      <md-card-title>Add/Edit Zone to {{ site.code }}</md-card-title>
    </md-card>
    <bc-zone-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [zone]="zone$ | async">
    </bc-site-form>
  `,
})
export class ZoneFormPageComponent implements OnInit, OnDestroy {
    error$: Observable<string | null>;
    zone$: Observable<Zone | null>;
    actionsSubscription: Subscription;
    @Input() site: Site;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.actionsSubscription = route.params
            .map(params => new SiteAction.SelectAction(params.id))
            .subscribe(store);
    }

    ngOnInit() {
        this.error$ = this.store.let(getSitePageError);
        this.zone$ = this.store.let(getSelectedZone);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    onSubmit(site: Site) {
        this.store.dispatch(new SiteAction.AddZoneAction(zone,site));
    }
}