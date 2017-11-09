import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedSite, getAuthUser } from '../../../modules/ngrx/index';
import { Site, Zone } from '../../../modules/datas/models/index';
import { User } from '../../../modules/countries/models/country';
import { SiteAction } from '../../../modules/datas/actions/index';

/**
 * Note: Container components are also reusable. Whether or not
 * a component is a presentation component or a container
 * component is an implementation detail.
 *
 * The View Book Page's responsibility is to map router params
 * to a 'Select' book action. Actually showing the selected
 * book remains a responsibility of the
 * SelectedBookPageComponent
 */
@Component({
  selector: 'bc-view-zone-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <md-card-title>{{ 'ZONES' | translate }}</md-card-title>
    <bc-zone 
      [site]="site$ | async"
      [zone]="zone$ | async">
    </bc-zone>
  `,
})
export class ViewZonePageComponent implements OnInit, OnDestroy {
  actionsSubscription: Subscription;
  zone$: Observable<Zone | null>;
  site$: Observable<Site | null>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
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
}
