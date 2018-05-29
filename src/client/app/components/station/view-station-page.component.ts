import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedPlatform, getAuthUser, getSelectedZone, getSelectedStation } from '../../modules/ngrx/index';
import { Platform, Zone, Station } from '../../modules/datas/models/index';
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
  selector: 'bc-view-station-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-view-station 
      [platform]="platform$ | async"
      [station]="station$ | async"
      (action)="actionStation($event)"
      (remove)="removeStation($event)">
    </bc-view-station>
  `,
})
export class ViewStationPageComponent implements OnInit, OnDestroy {
  platformSubscription: Subscription;
  stationSubscription: Subscription;
  platform$: Observable<Platform | null>;
  station$: Observable<Station | null>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.platformSubscription = route.params
      .map(params => new PlatformAction.SelectPlatformAction(params.idPlatform))
      .subscribe(store);
    this.stationSubscription = route.params
      .map(params => new PlatformAction.SelectStationAction(params.idStation))
      .subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.let(getSelectedPlatform);
    this.station$ = this.store.let(getSelectedStation);
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.stationSubscription.unsubscribe();
  }

  actionStation(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeStation(station: Station){
    this.store.dispatch(new PlatformAction.RemoveStationAction(station));
  }
}
