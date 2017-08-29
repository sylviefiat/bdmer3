import 'rxjs/add/operator/take';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState, getSearchQuery, getSearchResults, getSearchLoading } from '../../modules/ngrx/index';
import { RouterExtensions, Config } from '../../modules/core/index';

import { BookAction } from '../../modules/books/actions/index';
import { Book } from '../../modules/books/models/book';

@Component({
  selector: 'bc-find-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-search [query]="searchQuery$ | async" [searching]="loading$ | async" (search)="search($event)"></bc-book-search>
    <bc-book-preview-list [books]="books$ | async"></bc-book-preview-list>
  `,
})
export class FindBookPageComponent implements OnInit {  
  searchQuery$: Observable<any>;
  books$: Observable<any>;
  loading$: Observable<any>;


  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
    this.searchQuery$ = this.store.let(getSearchQuery).take(1);
    this.books$ = this.store.let(getSearchResults);
    this.loading$ = this.store.let(getSearchLoading);
  }

  search(query: string) {
    //console.log(query);
    this.store.dispatch(new BookAction.SearchAction(query));
  }
}
