import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAppState, getSelectedPlatform, getAuthUser, getSelectedZone, getSelectedZoneStations, getSelectedZoneZonePrefs } from '../../modules/ngrx/index';
import { Platform, Zone, Station, ZonePreference } from '../../modules/datas/models/index';
import { User } from '../../modules/countries/models/country';
import { PlatformAction } from '../../modules/datas/actions/index';


@Component({
  selector: 'bc-view-zone-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-view-zone 
      [platform]="(platform$ | async)"
      [zone]="zone$ | async"
      [stations$]="stations$"
      [zonesPref$]="zonesPref$"
      (action)="actionZone($event)"
      (remove)="removeZone($event)">
    </bc-view-zone>
  `,
})
export class ViewZonePageComponent implements OnInit, OnDestroy {
  platformSubscription: Subscription;
  zoneSubscription: Subscription;
  zone$: Observable<Zone | null>;
  platform$: Observable<Platform | null>;
  stations$: Observable<Station[]>;
  zonesPref$: Observable<ZonePreference[]>

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.platformSubscription = route.params.pipe(
      map(params => new PlatformAction.SelectPlatformAction(params.idPlatform)))
      .subscribe(store);
    this.zoneSubscription = route.params.pipe(
      map(params => new PlatformAction.SelectZoneAction(params.idZone)))
      .subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.select(getSelectedPlatform);
    this.zone$ = this.store.select(getSelectedZone);
    this.stations$ = this.store.select(getSelectedZoneStations);
    this.zonesPref$ = this.store.select(getSelectedZoneZonePrefs);
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
  }

  actionZone(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeZone(zone: Zone){
    this.store.dispatch(new PlatformAction.RemoveZoneAction(zone));
  }
}
