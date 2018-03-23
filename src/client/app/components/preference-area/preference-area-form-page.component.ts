import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform, Zone, ZonePreference } from '../../modules/datas/models/index';
import { Species } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getSelectedZone, getSelectedZonePref, getSpeciesInApp } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { SpeciesAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-zone-pref-page',
  template: `
    <bc-zone-pref-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [platform]="platform$ | async"
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
  platform$: Observable<Platform>;
  zone$: Observable<Zone>;
  zonePref$: Observable<ZonePreference>;
  speciesList$: Observable<Species[]>;
  platformSubscription: Subscription;
  zoneSubscription: Subscription;
  zonePrefSubscription: Subscription;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {
    this.platformSubscription = route.params
      .map(params => new PlatformAction.SelectPlatformAction(params.idPlatform))
      .subscribe(store);      
    this.zoneSubscription = route.params
      .map(params => new PlatformAction.SelectZoneAction(params.idZone))
      .subscribe(store);
    this.zonePrefSubscription = route.params
      .map(params => new PlatformAction.SelectZonePrefAction(params.idZonePref))
      .subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.let(getSelectedPlatform);
    this.zone$ = this.store.let(getSelectedZone);
    this.zonePref$ = this.store.let(getSelectedZonePref);
    this.speciesList$ = this.store.let(getSpeciesInApp);
    this.store.dispatch(new SpeciesAction.LoadAction());  
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
    this.zonePrefSubscription.unsubscribe();
  }

  onSubmit(zonePref: ZonePreference) { 
    console.log(zonePref);
      this.store.dispatch(new PlatformAction.AddZonePrefAction(zonePref))
  }
}