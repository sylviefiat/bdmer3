import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { RouterExtensions, Config } from "../../modules/core/index";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subscription, pipe } from "rxjs";
import { map } from "rxjs/operators";

import {
  IAppState,
  getSelectedPlatform,
  getSelectedPlatformZones,
  getSelectedPlatformStations,
  getSelectedPlatformSurveys,
  getPlatformPageMsg,
  getAllCountriesInApp
} from "../../modules/ngrx/index";
import { Platform, Zone, Survey, Station } from "../../modules/datas/models/index";
import { User } from "../../modules/countries/models/country";
import { PlatformAction } from "../../modules/datas/actions/index";
import { PlatformService } from "../../modules/datas/services/platform.service";
import { Country } from "../../modules/countries/models/country";

@Component({
  selector: "bc-view-platform-page",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-view-platform
      [platform]="platform$ | async"
      [zones$]="zones$"
      [stations$]="stations$"
      [surveys$]="surveys$"
      [msg]="msg$ | async"
      [countries]="countries$ | async"
      (action)="actionPlatform($event)"
      (remove)="removePlatform($event)">
    </bc-view-platform>
  `
})
export class ViewPlatformPageComponent implements OnInit, OnDestroy {
  actionsSubscription: Subscription;
  platform$: Observable<Platform | null>;
  zones$: Observable<Zone[]>;
  stations$: Observable<Station[]>;
  surveys$: Observable<Survey[]>;
  msg$: Observable<string | null>;
  countries$: Observable<Country[]>;

  constructor(private platformService: PlatformService, private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    this.actionsSubscription = route.params.pipe(map(params => new PlatformAction.SelectPlatformAction(params.id))).subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.select(getSelectedPlatform);
    this.zones$ = this.store.select(getSelectedPlatformZones);
    this.stations$ = this.store.select(getSelectedPlatformStations);
    this.surveys$ = this.store.select(getSelectedPlatformSurveys);
    this.msg$ = this.store.select(getPlatformPageMsg);
    this.countries$ = this.store.select(getAllCountriesInApp);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

  actionPlatform(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removePlatform(platform: Platform) {
    this.platformService.getPlatform(platform.code).subscribe(res => this.store.dispatch(new PlatformAction.RemovePlatformAction(res)));
  }
}
