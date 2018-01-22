import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site, Zone, Transect, Count } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite, getSelectedZone, getSelectedTransect, getSelectedCount } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-count-page',
  template: `
    <bc-count-form-page
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [site]="site$ | async"
      [zone]="zone$ | async"
      [transect]="transect$ | async"
      [count]="count$ | async">
    </bc-count-form-page>
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
    
    .toolbar {
      background-color: #106cc8;
      color: rgba(255, 255, 255, 0.87);
      display: block;
      padding:10px;
    }
    `]
})
export class CountFormPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  site$: Observable<Site>;
  zone$: Observable<Zone>;
  transect$: Observable<Transect>;
  count$: Observable<Count>;
  siteSubscription: Subscription;
  zoneSubscription: Subscription;
  transectSubscription: Subscription;
  countSubscription: Subscription;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {
    this.siteSubscription = route.params
      .map(params => new SiteAction.SelectSiteAction(params.idSite))
      .subscribe(store);      
    this.zoneSubscription = route.params
      .map(params => new SiteAction.SelectZoneAction(params.idZone))
      .subscribe(store);
    this.transectSubscription = route.params
      .map(params => new SiteAction.SelectTransectAction(params.idTransect))
      .subscribe(store);
    this.countSubscription = route.params
      .map(params => new SiteAction.SelectCountAction(params.idCount))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.zone$ = this.store.let(getSelectedZone);
    this.transect$ = this.store.let(getSelectedTransect);
    this.count$ = this.store.let(getSelectedCount);
  }

  ngOnDestroy() {
    this.siteSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
    this.transectSubscription.unsubscribe();
    this.countSubscription.unsubscribe();
  }

  onSubmit(count: Count) { 
    console.log(count);
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