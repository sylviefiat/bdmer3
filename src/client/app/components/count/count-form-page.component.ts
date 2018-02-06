import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site, Zone, Campaign, Count, Species, Transect } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite, getSelectedZone, getSelectedCampaign, getSelectedCount, getSpeciesInApp } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';
import { SpeciesAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-count-page',
  template: `
    <bc-count-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [site]="site$ | async"
      [campaign]="campaign$ | async"
      [count]="count$ | async"
      [species]="species$ | async">
    </bc-count-form>
  `,
  styles: [
    `
    #count-page {
      display: flex;
      flex-direction:row;
      justify-content: center;
      margin: 72px 0;
    }
    mat-card {
      min-width: 500px;
    }
    `]
})
export class CountFormPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  site$: Observable<Site>;
  campaign$: Observable<Campaign>;
  count$: Observable<Count>;
  species$: Observable<Species[]>;
  siteSubscription: Subscription;
  campaignSubscription: Subscription;
  countSubscription: Subscription;


  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {
    this.siteSubscription = route.params
      .map(params => new SiteAction.SelectSiteAction(params.idSite))
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
    this.campaign$ = this.store.let(getSelectedCampaign);
    this.count$ = this.store.let(getSelectedCount);
    this.species$ = this.store.let(getSpeciesInApp);
    this.store.dispatch(new SpeciesAction.LoadAction());
  }

  ngOnDestroy() {
    this.siteSubscription.unsubscribe();
    this.campaignSubscription.unsubscribe();
    this.countSubscription.unsubscribe();
  }

  onSubmit(count: Count) { 
    this.store.dispatch(new SiteAction.AddCountAction(count))
  }

  return() {
    this.routerext.navigate(['/site/'], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }
}