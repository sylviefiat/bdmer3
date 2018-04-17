import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedPlatform, getAuthUser, getSelectedZone, getSelectedTransect } from '../../modules/ngrx/index';
import { Platform, Zone, Transect } from '../../modules/datas/models/index';
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
  selector: 'bc-view-transect-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-view-transect 
      [platform]="platform$ | async"
      [zone]="zone$ | async"
      [transect]="transect$ | async"
      (action)="actionTransect($event)"
      (remove)="removeTransect($event)">
    </bc-view-transect>
  `,
})
export class ViewTransectPageComponent implements OnInit, OnDestroy {
  platformSubscription: Subscription;
  zoneSubscription: Subscription;
  transectSubscription: Subscription;
  zone$: Observable<Zone | null>;
  platform$: Observable<Platform | null>;
  transect$: Observable<Transect | null>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.platformSubscription = route.params
      .map(params => new PlatformAction.SelectPlatformAction(params.idPlatform))
      .subscribe(store);
    this.zoneSubscription = route.params
      .map(params => new PlatformAction.SelectZoneAction(params.idZone))
      .subscribe(store);
    this.transectSubscription = route.params
      .map(params => new PlatformAction.SelectTransectAction(params.idTransect))
      .subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.let(getSelectedPlatform);
    this.zone$ = this.store.let(getSelectedZone);
    this.transect$ = this.store.let(getSelectedTransect);
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
    this.transectSubscription.unsubscribe();
  }

  actionTransect(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeTransect(transect: Transect){
    this.store.dispatch(new PlatformAction.RemoveTransectAction(transect));
  }
}
