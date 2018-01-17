import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../../modules/core/index';
import { Site, Zone, Transect } from '../../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite, getSelectedZone, getSelectedTransect } from '../../../modules/ngrx/index';
import { SiteAction } from '../../../modules/datas/actions/index';

@Component({
  selector: 'bc-transect-page',
  template: `
    <bc-transect-form-page
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [site]="site$ | async"
      [zone]="zone$ | async"
      [transect]="transect$ | async">
    </bc-transect-form-page>
  `,
  styles: [
    `
    #transect-page {
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
export class TransectFormPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  site$: Observable<Site>;
  zone$: Observable<Zone>;
  transect$: Observable<Transect>;
  siteSubscription: Subscription;
  zoneSubscription: Subscription;
  transectSubscription: Subscription;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {
    this.siteSubscription = route.params
      .map(params => new SiteAction.SelectSiteAction(params.idsite))
      .subscribe(store);      
    this.zoneSubscription = route.params
      .map(params => new SiteAction.SelectZoneAction(params.idzone))
      .subscribe(store);
    this.transectSubscription = route.params
      .map(params => new SiteAction.SelectTransectAction(params.idtransect))
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

  onSubmit(transect: Transect) { 
    console.log(transect);
      this.store.dispatch(new SiteAction.AddTransectAction(transect))
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