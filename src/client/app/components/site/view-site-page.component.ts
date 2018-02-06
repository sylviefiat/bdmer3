import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedSite, getSitePageMsg } from '../../modules/ngrx/index';
import { Site, Zone, Campaign } from '../../modules/datas/models/index';
import { User } from '../../modules/countries/models/country';
import { SiteAction } from '../../modules/datas/actions/index';

/**
 * Note: Container components are also reusable. Whether or not
 * a component is a presentation component or a container
 * component is an implementation detail.
 *
 * The View Book Page's responsibility is to map router params
 * to a 'Select' book action. Actually showing the selected
 * book remains a responsibility of the
 * SelectedBookPageComponent
 */
@Component({
  selector: 'bc-view-site-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-view-site 
      [site]="site$ | async"
      [zones$]="zones$"
      [campaigns$]="campaigns$"
      [msg]="msg$ | async"
      (action)="actionSite($event)"
      (remove)="removeSite($event)">
    </bc-view-site>
  `,
})
export class ViewSitePageComponent implements OnInit, OnDestroy {
  actionsSubscription: Subscription;
  site$: Observable<Site | null>;
  zones$: Observable<Zone[]>;
  campaigns$: Observable<Campaign[]>;
  msg$: Observable<string | null>;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    this.actionsSubscription = route.params
      .map(params => new SiteAction.SelectSiteAction(params.id))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.zones$ = this.site$.map(site => site.zones);
    this.campaigns$ = this.site$.map(site => site.campaigns);    
    this.msg$ = this.store.let(getSitePageMsg);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

  actionSite(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeSite(site: Site) {
    this.store.dispatch(new SiteAction.RemoveSiteAction(site));
  }
}
