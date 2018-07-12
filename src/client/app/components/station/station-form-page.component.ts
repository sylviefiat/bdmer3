import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of, Subscription, pipe } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from "@angular/forms";

import { RouterExtensions, Config } from "../../modules/core/index";
import { Platform, Zone, Station } from "../../modules/datas/models/index";

import {
  IAppState,
  getPlatformPageError,
  getSelectedPlatform,
  getAllCountriesInApp,
  getSelectedZone,
  getSelectedStation
} from "../../modules/ngrx/index";
import { PlatformAction } from "../../modules/datas/actions/index";

@Component({
  selector: "bc-station-page",
  template: `
    <bc-station-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [platform]="platform$ | async"
      [station]="station$ | async">
    </bc-station-form>
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
    `
  ]
})
export class StationFormPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  platform$: Observable<Platform>;
  station$: Observable<Station>;
  platformSubscription: Subscription;
  zoneSubscription: Subscription;
  stationSubscription: Subscription;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {
    this.platformSubscription = route.params.pipe(map(params => new PlatformAction.SelectPlatformAction(params.idPlatform))).subscribe(store);
    this.stationSubscription = route.params.pipe(map(params => new PlatformAction.SelectStationAction(params.idStation))).subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.select(getSelectedPlatform);
    this.station$ = this.store.select(getSelectedStation);
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.stationSubscription.unsubscribe();
  }

  onSubmit(station: Station) {
    this.store.dispatch(new PlatformAction.AddStationAction(station));
  }
}
