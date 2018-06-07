
import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAppState } from '../../modules/ngrx/index';

import { CountryAction } from '../../modules/countries/actions/index';

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
  selector: 'bc-view-country-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-selected-country-page></bc-selected-country-page>
  `,
})
export class ViewCountryPageComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(store: Store<IAppState>, route: ActivatedRoute) {    
    this.actionsSubscription = route.params.pipe(
      map(params => new CountryAction.SelectAction(params.id)))
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
