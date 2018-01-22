import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site, Zone, ZonePreference } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite, getSelectedZone, getSelectedZonePref } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-zone-pref-page',
  template: `
    <bc-zone-pref-form-page
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [site]="site$ | async"
      [zone]="zone$ | async"
      [zonePref]="zonePref$ | async">
    </bc-zone-pref-form-page>
  `,
  styles: [
    `
    #zone-pref-page {
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
export class PreferenceAreaFormPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  site$: Observable<Site>;
  zone$: Observable<Zone>;
  zonePref$: Observable<ZonePreference>;
  siteSubscription: Subscription;
  zoneSubscription: Subscription;
  zonePrefSubscription: Subscription;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {
    this.siteSubscription = route.params
      .map(params => new SiteAction.SelectSiteAction(params.idSite))
      .subscribe(store);      
    this.zoneSubscription = route.params
      .map(params => new SiteAction.SelectZoneAction(params.idZone))
      .subscribe(store);
    this.zonePrefSubscription = route.params
      .map(params => new SiteAction.SelectTransectAction(params.idZonePref))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.zone$ = this.store.let(getSelectedZone);
    this.zonePref$ = this.store.let(getSelectedZonePref);
  }

  ngOnDestroy() {
    this.siteSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
    this.zonePrefSubscription.unsubscribe();
  }

  onSubmit(zonePref: ZonePreference) { 
    console.log(zonePref);
      this.store.dispatch(new SiteAction.AddZonePrefAction(zonePref))
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