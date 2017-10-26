import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedSite, getAuthUser } from '../../../modules/ngrx/index';
import { Site } from '../../../modules/datas/models/index';
import { User } from '../../../modules/countries/models/country';
import { SiteAction } from '../../../modules/datas/actions/index';

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
      [currentUser]="currentUser$ | async"
      (edit)="editSite($event)"
      (remove)="removeSite($event)">
    </bc-view-site>
  `,
})
export class ViewSitePageComponent implements OnInit, OnDestroy {
  actionsSubscription: Subscription;
  site$: Observable<Site | null>;
  currentUser$: Observable<User>;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    this.actionsSubscription = route.params
      .map(params => new SiteAction.SelectAction(params.id))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.currentUser$ = this.store.let(getAuthUser);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

  editSite(site: Site) {
    this.routerext.navigate(['/siteForm/' + site._id], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }
  removeSite(site: Site) {
    this.store.dispatch(new SiteAction.RemoveSiteAction(site));
  }
}
