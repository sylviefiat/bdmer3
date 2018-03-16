import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site, Zone, Campaign } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite, getSelectedZone, getSelectedCampaign } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-campaign-page',
  template: `
    <bc-campaign-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [site]="site$ | async"
      [campaign]="campaign$ | async">
    </bc-campaign-form>
  `,
  styles: [
    `
    mat-card {
      text-align: center;
    }
    mat-card-title {
      display: flex;
      justify-content: center;
    }
    `]
})
export class CampaignFormPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  site$: Observable<Site>;
  campaign$: Observable<Campaign>;
  siteSubscription: Subscription;
  campaignSubscription: Subscription;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute,) {
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
  }

  ngOnDestroy() {
    this.siteSubscription.unsubscribe();
    this.campaignSubscription.unsubscribe();
  }

  onSubmit(campaign: Campaign) { 
    this.store.dispatch(new SiteAction.AddCampaignAction(campaign));
  }
}
