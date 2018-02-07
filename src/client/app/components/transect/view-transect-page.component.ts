import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedSite, getAuthUser, getSelectedZone, getSelectedTransect } from '../../modules/ngrx/index';
import { Site, Zone, Transect } from '../../modules/datas/models/index';
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
  selector: 'bc-view-transect-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-transect 
      [site]="site$ | async"
      [zone]="zone$ | async"
      [transect]="transect$ | async"
      (action)="actionTransect($event)"
      (remove)="removeTransect($event)">
    </bc-transect>
  `,
})
export class ViewTransectPageComponent implements OnInit, OnDestroy {
  siteSubscription: Subscription;
  zoneSubscription: Subscription;
  transectSubscription: Subscription;
  zone$: Observable<Zone | null>;
  site$: Observable<Site | null>;
  transect$: Observable<Transect | null>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.siteSubscription = route.params
      .map(params => new SiteAction.SelectSiteAction(params.idSite))
      .subscribe(store);
    this.zoneSubscription = route.params
      .map(params => new SiteAction.SelectZoneAction(params.idZone))
      .subscribe(store);
    this.transectSubscription = route.params
      .map(params => new SiteAction.SelectTransectAction(params.idTransect))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.zone$ = this.store.let(getSelectedZone);
    this.transect$ = this.store.let(getSelectedTransect);
  }

  ngOnDestroy() {
    this.siteSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
    this.transectSubscription.unsubscribe();
  }

  actionTransect(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeTransect(transect: Transect){
    this.store.dispatch(new SiteAction.RemoveTransectAction(transect));
  }
}
