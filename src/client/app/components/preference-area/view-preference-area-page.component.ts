import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedSite, getAuthUser, getSelectedZone, getSelectedZonePref } from '../../modules/ngrx/index';
import { Site, Zone, ZonePreference } from '../../modules/datas/models/index';
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
  selector: 'bc-view-zone-pref-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-zone-pref 
      [site]="site$ | async"
      [zone]="zone$ | async"
      [zonePref]="zonePref$ | async"
      (action)="actionZonePref($event)"
      (remove)="removeZonePref($event)">
    </bc-zone-pref>
  `,
})
export class ViewPreferenceAreaPageComponent implements OnInit, OnDestroy {
  siteSubscription: Subscription;
  zoneSubscription: Subscription;
  zonePrefSubscription: Subscription;
  zone$: Observable<Zone | null>;
  site$: Observable<Site | null>;
  zonePref$: Observable<ZonePreference | null>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.siteSubscription = route.params
      .map(params => new SiteAction.SelectSiteAction(params.idSite))
      .subscribe(store);
    this.zoneSubscription = route.params
      .map(params => new SiteAction.SelectZoneAction(params.idZone))
      .subscribe(store);
    this.zonePrefSubscription = route.params
      .map(params => new SiteAction.SelectZonePrefAction(params.idZonePref))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.zone$ = this.store.let(getSelectedZone);
    this.zonePref$ = this.store.let(getSelectedZonePref);
  }

  ngOnDestroy() {
    this.siteSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
    this.zonePrefSubscription.unsubscribe();
  }

  actionZonePref(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeZonePref(zonePref: ZonePreference){
    this.store.dispatch(new SiteAction.RemoveZonePrefAction(zonePref));
  }
}
