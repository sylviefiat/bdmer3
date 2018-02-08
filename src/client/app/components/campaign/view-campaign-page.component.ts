import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedSite, getAuthUser, getSelectedZone, getSelectedCampaign, getSelectedCampaignCounts, getLangues, getSpeciesInApp } from '../../modules/ngrx/index';
import { Site, Zone, Campaign, Count, Species } from '../../modules/datas/models/index';
import { User } from '../../modules/countries/models/country';
import { SiteAction, SpeciesAction } from '../../modules/datas/actions/index';

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
  selector: 'bc-view-campaign-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-campaign 
      [site]="site$ | async"
      [campaign]="campaign$ | async"
      [counts$]="counts$"
      [locale]="locale$ | async"
      [species]="species$ | async"
      (action)="actionCampaign($event)"
      (remove)="removeCampaign($event)">
    </bc-campaign>
  `,
})
export class ViewCampaignPageComponent implements OnInit, OnDestroy {
  siteSubscription: Subscription;
  campaignSubscription: Subscription;
  site$: Observable<Site | null>;
  campaign$: Observable<Campaign | null>;
  counts$: Observable<Count[]>
  locale$: Observable<string>;
  species$: Observable<Species[]>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.siteSubscription = route.params
      .map(params => new SiteAction.SelectSiteAction(params.idSite))
      .subscribe(store);
    this.campaignSubscription = route.params
      .map(params => new SiteAction.SelectCampaignAction(params.idCampaign))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.campaign$ = this.store.let(getSelectedCampaign);
    this.counts$ = this.store.let(getSelectedCampaignCounts);
    this.locale$ = this.store.let(getLangues);
    this.species$ = this.store.let(getSpeciesInApp);
    this.store.dispatch(new SpeciesAction.LoadAction());
  }

  ngOnDestroy() {
    this.siteSubscription.unsubscribe();
    this.campaignSubscription.unsubscribe();
  }

  actionCampaign(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeCampaign(campaign: Campaign){
    this.store.dispatch(new SiteAction.RemoveCampaignAction(campaign));
  }
}
