import 'rxjs/add/operator/let';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import { PouchDBService } from "../../modules/core/services/pouchdb.service";

import { IAppState, getBookCollection } from '../../modules/ngrx/index';
import { CollectionAction } from '../../modules/books/actions/index';
import { Book } from '../../modules/books/models/book';

@Component({
  selector: 'bc-collection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>My Collection</mat-card-title>
    </mat-card>

    <bc-book-preview-list [books]="books$ | async"></bc-book-preview-list>
    
  `,
  /**
   * Container components are permitted to have just enough styles
   * to bring the view together. If the number of styles grow,
   * consider breaking them out into presentational
   * components.
   */
  styles: [
    `
    mat-card-title {
      display: flex;
      justify-content: center;
    }
  `,
  ],
})
export class CollectionPageComponent implements OnInit {
  books$: Observable<Book[]>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {    
    this.books$ = this.store.let(getBookCollection);
    this.store.dispatch(new CollectionAction.LoadAction());    
  }
}
