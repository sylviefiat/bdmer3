import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site, Zone, ZonePreference } from '../../modules/datas/models/index';
import { Species } from '../../modules/datas/models/index';

import { IAppState, getSitePageError, getSelectedSite, getSelectedZone, getSelectedZonePref, getSpeciesInApp } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';
import { SpeciesAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-zone-pref-page',
  template: `
    <bc-zone-pref-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [site]="site$ | async"
      [zone]="zone$ | async"
      [zonePref]="zonePref$ | async"
      [species]="speciesList$ | async">
    </bc-zone-pref-form>
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
export class PreferenceAreaFormPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  site$: Observable<Site>;
  zone$: Observable<Zone>;
  zonePref$: Observable<ZonePreference>;
  speciesList$: Observable<Species[]>;
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
      .map(params => new SiteAction.SelectZonePrefAction(params.idZonePref))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.zone$ = this.store.let(getSelectedZone);
    this.zonePref$ = this.store.let(getSelectedZonePref);
    this.speciesList$ = this.store.let(getSpeciesInApp);
    this.store.dispatch(new SpeciesAction.LoadAction());  
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
}