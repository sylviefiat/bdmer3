import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedSite, getAuthUser, getSelectedZone, getSelectedTransect, getSelectedCampaign,getSelectedCount } from '../../modules/ngrx/index';
import { Site, Zone, Campaign, Transect, Count } from '../../modules/datas/models/index';
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
  selector: 'bc-view-count-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-count 
      [site]="site$ | async"
      [zone]="zone$ | async"
      [campaign]="campaign$ | async"
      [count]="count$ | async"
      (remove)="removeCount($event)">
    </bc-count>
  `,
})
export class ViewCountPageComponent implements OnInit, OnDestroy {
  siteSubscription: Subscription;
  zoneSubscription: Subscription;
  campaignSubscription: Subscription;
  countSubscription: Subscription;
  zone$: Observable<Zone | null>;
  site$: Observable<Site | null>;
  campaign$: Observable<Campaign | null>;
  count$: Observable<Count | null>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.siteSubscription = route.params
      .map(params => new SiteAction.SelectSiteAction(params.idSite))
      .subscribe(store);
    this.zoneSubscription = route.params
      .map(params => new SiteAction.SelectZoneAction(params.idZone))
      .subscribe(store);
    this.campaignSubscription = route.params
      .map(params => new SiteAction.SelectCampaignAction(params.idCampaign))
      .subscribe(store);
    this.countSubscription = route.params
      .map(params => new SiteAction.SelectCountAction(params.idCount))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.zone$ = this.store.let(getSelectedZone);
    this.campaign$ = this.store.let(getSelectedCampaign);
    this.count$ = this.store.let(getSelectedCount);
  }

  ngOnDestroy() {
    this.siteSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
    this.campaignSubscription.unsubscribe();
    this.countSubscription.unsubscribe();
  }

  removeCount(count: Count){
    this.store.dispatch(new SiteAction.RemoveCountAction(count));
  }
}
