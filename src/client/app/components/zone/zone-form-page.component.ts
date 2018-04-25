import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform, Zone } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getSelectedZone } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-zone-page',
  template: `
    <bc-zone-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [platform]="platform$ | async"
      [zone]="zone$ | async">
    </bc-zone-form>
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
export class ZoneFormPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  platform$: Observable<Platform>;
  zone$: Observable<Zone | null>;
  platformSubscription: Subscription;
  zoneSubscription: Subscription;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {
    this.platformSubscription = route.params
      .map(params => new PlatformAction.SelectPlatformAction(params.idPlatform))
      .subscribe(store);
    this.zoneSubscription = route.params
      .map(params => new PlatformAction.SelectZoneAction(params.idZone))
      .subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.let(getSelectedPlatform);
    this.zone$ = this.store.let(getSelectedZone);
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
  }

  onSubmit(zone: Zone) {
   this.store.dispatch(new PlatformAction.AddZoneAction(zone))
  }
}