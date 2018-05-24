import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedPlatform, getSelectedPlatformZones, getSelectedPlatformSurveys, getPlatformPageMsg } from '../../modules/ngrx/index';
import { Platform, Zone, Survey } from '../../modules/datas/models/index';
import { User } from '../../modules/countries/models/country';
import { PlatformAction } from '../../modules/datas/actions/index';
import { PlatformService } from '../../modules/datas/services/platform.service';


@Component({
  selector: 'bc-view-platform-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-view-platform 
      [platform]="platform$ | async"
      [zones$]="zones$"
      [surveys$]="surveys$"
      [msg]="msg$ | async"
      (action)="actionPlatform($event)"
      (remove)="removePlatform($event)">
    </bc-view-platform>
  `,
})
export class ViewPlatformPageComponent implements OnInit, OnDestroy {
  actionsSubscription: Subscription;
  platform$: Observable<Platform | null>;
  zones$: Observable<Zone[]>;
  surveys$: Observable<Survey[]>;
  msg$: Observable<string | null>;

  constructor(private platformService: PlatformService, private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    this.actionsSubscription = route.params
      .map(params => new PlatformAction.SelectPlatformAction(params.id))
      .subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.let(getSelectedPlatform);
    this.zones$ = this.store.let(getSelectedPlatformZones);
    this.surveys$ = this.store.let(getSelectedPlatformSurveys);
    this.msg$ = this.store.let(getPlatformPageMsg);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

  actionPlatform(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removePlatform(platform: Platform) {
    this.platformService.getPlatform(platform.code).subscribe(
        (res) => {
          this.store.dispatch(new PlatformAction.RemovePlatformAction(res));
         }
    );
  }
}
