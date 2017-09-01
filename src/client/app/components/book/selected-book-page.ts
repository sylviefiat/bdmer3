import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getSelectedBook, isSelectedBookInCollection } from '../../modules/ngrx/index';
import { CollectionAction } from '../../modules/books/actions/index';
import { Book } from '../../modules/books/models/book';

@Component({
  selector: 'bc-selected-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-detail
      [book]="book$ | async"
      [inCollection]="isSelectedBookInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)">
    </bc-book-detail>
  `,
})
export class SelectedBookPageComponent implements OnInit {
  book$: Observable<Book>;
  isSelectedBookInCollection$: Observable<boolean>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
    console.log("initbook");
    this.book$ = this.store.let(getSelectedBook);
    this.isSelectedBookInCollection$ = this.store.let(
      isSelectedBookInCollection
    );
  }

  addToCollection(book: Book) {
    this.store.dispatch(new CollectionAction.AddBookAction(book));
  }

  removeFromCollection(book: Book) {
    this.store.dispatch(new CollectionAction.RemoveBookAction(book));
  }
}
