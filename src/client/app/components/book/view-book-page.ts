import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { IAppState } from '../../modules/ngrx/index';

import { BookAction } from '../../modules/books/actions/index';

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
  selector: 'bc-view-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-selected-book-page></bc-selected-book-page>
  `,
})
export class ViewBookPageComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(store: Store<IAppState>, route: ActivatedRoute) {
    this.actionsSubscription = route.params
      .map(params => new BookAction.SelectAction(params.id))
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
