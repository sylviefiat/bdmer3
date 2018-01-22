import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedSite, getAuthUser, getSelectedZone } from '../../modules/ngrx/index';
import { Site, Zone } from '../../modules/datas/models/index';
import { User } from '../../modules/countries/models/country';
import { SiteAction } from '../../modules/datas/actions/index';

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
    <bc-zone 
      [site]="(site$ | async)"
      [zone]="zone$ | async"
      (remove)="removeZone($event)">
    </bc-zone>
  `,
})
export class ViewZonePageComponent implements OnInit, OnDestroy {
  siteSubscription: Subscription;
  zone$: Observable<Zone | null>;
  site$: Observable<Site | null>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.siteSubscription = route.params
      .map(params => new SiteAction.SelectSiteAction(params.idSite))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.zone$ = this.site$
      .mergeMap(site => 
        this.route.params
          .map(params => site.zones.filter(zone => zone.code===params.idZone)[0]));
  }

  ngOnDestroy() {
    this.siteSubscription.unsubscribe();
  }

  removeZone(site: Site){
    console.log(site);
    this.store.dispatch(new SiteAction.AddSiteAction(site));
  }
}
