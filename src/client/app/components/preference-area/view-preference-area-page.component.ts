import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of, pipe } from 'rxjs';
import { map, catchError, first } from 'rxjs/operators';

import { IAppState, getSelectedPlatform, getAuthUser, getSelectedZone, getSelectedZonePref } from '../../modules/ngrx/index';
import { Platform, Zone, ZonePreference } from '../../modules/datas/models/index';
import { User } from '../../modules/countries/models/country';
import { PlatformAction } from '../../modules/datas/actions/index';

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
      [platform]="platform$ | async"
      [zone]="zone$ | async"
      [zonePref]="zonePref$ | async"
      (action)="actionZonePref($event)"
      (remove)="removeZonePref($event)">
    </bc-zone-pref>
  `,
})
export class ViewPreferenceAreaPageComponent implements OnInit, OnDestroy {
  platformSubscription: Subscription;
  zoneSubscription: Subscription;
  zonePrefSubscription: Subscription;
  zone$: Observable<Zone | null>;
  platform$: Observable<Platform | null>;
  zonePref$: Observable<ZonePreference | null>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.platformSubscription = route.params.pipe(
      map(params => new PlatformAction.SelectPlatformAction(params.idPlatform)))
      .subscribe(store);
    this.zoneSubscription = route.params.pipe(
      map(params => new PlatformAction.SelectZoneAction(params.idZone)))
      .subscribe(store);
    this.zonePrefSubscription = route.params.pipe(
      map(params => new PlatformAction.SelectZonePrefAction(params.idZonePref)))
      .subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.select(getSelectedPlatform);
    this.zone$ = this.store.select(getSelectedZone);
    this.zonePref$ = this.store.select(getSelectedZonePref);
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
    this.zonePrefSubscription.unsubscribe();
  }

  actionZonePref(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeZonePref(zonePref: ZonePreference){
    this.store.dispatch(new PlatformAction.RemoveZonePrefAction(zonePref));
  }
}
