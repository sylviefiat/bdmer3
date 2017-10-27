import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../../modules/core/index';
import { Site, Zone } from '../../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite } from '../../../modules/ngrx/index';
import { SiteAction } from '../../../modules/datas/actions/index';

@Component({
    selector: 'bc-zone-page',
    template: `
    <md-card>
      <md-card-title class="toolbar"><fa [name]="'street-view'" [border]=true [size]=1 ></fa>Add/Edit Zone</md-card-title>
    </md-card>
    <bc-zone-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [site]="site$ | async"
      [zone]="zone$ | async">
    </bc-zone-form>
  `,
    styles: [
        `
    .toolbar {
      background-color: #106cc8;
      color: rgba(255, 255, 255, 0.87);
      display: block;
      padding:10px;
    }
    `]
})
export class ZoneFormPageComponent implements OnInit, OnDestroy {
    error$: Observable<string | null>;
    site$: Observable<Site>;
    zone$: Observable<Zone | null>;
    actionsSubscription: Subscription;
    @Input() site: Site;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute) {
        this.actionsSubscription = route.params
            .map(params => new SiteAction.SelectAction(params.idsite))
            .subscribe(store);
    }

    ngOnInit() {
        this.site$ = this.store.let(getSelectedSite);
        this.zone$ = this.site$
            .mergeMap((site: Site) =>
                this.route.params.map(params => params.idzone)
                    .mergeMap(idzone => {
                        console.log(idzone);
                        console.log(site.zones);
                        return of(site.zones.filter(zone => zone.code === idzone)[0])
                    }))
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    onSubmit(zone: Zone) {
        this.store.dispatch(new SiteAction.AddZoneAction({ site: this.site, zone: zone }));
    }
}