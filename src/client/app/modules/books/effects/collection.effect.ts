import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { Injectable, NgZone } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { of } from 'rxjs/observable/of';
import { PouchDBService } from "../../core/services/pouchdb.service";

import { CollectionAction } from '../actions/index';
import { Book } from '../models/book';

@Injectable()
export class CollectionEffects {
  /**
   * This effect does not yield any actions back to the store. Set
   * `dispatch` to false to hint to @ngrx/effects that it should
   * ignore any elements of this effect stream.
   *
   * The `defer` observable accepts an observable factory function
   * that is called when the observable is subscribed to.
   * Wrapping the database open call in `defer` makes
   * effect easier to test.
   */
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => { 
    return this.database.initDB();
  });

  @Effect()
  loadCollection$: Observable<Action> = this.actions$
    .ofType(CollectionAction.ActionTypes.LOAD)
    .switchMap(() =>     
      this.database
        .getAll()
        .map((books: Book[]) => new CollectionAction.LoadSuccessAction(books))
        .catch(error => of(new CollectionAction.LoadFailAction(error)))
    
    );

  @Effect()
  addBookToCollection$: Observable<Action> = this.actions$
    .ofType(CollectionAction.ActionTypes.ADD_BOOK)
    .map((action: CollectionAction.AddBookAction) => action.payload)
    .mergeMap(book => 
      fromPromise(this.database
        .add(book))
        .map(() => new CollectionAction.AddBookSuccessAction(book))
        .catch(() => of(new CollectionAction.AddBookFailAction(book)))
    );

  @Effect()
  removeBookFromCollection$: Observable<Action> = this.actions$
    .ofType(CollectionAction.ActionTypes.REMOVE_BOOK)
    .map((action: CollectionAction.RemoveBookAction) => action.payload)
    .mergeMap(book =>
      fromPromise(this.database
        .delete(book))
        .map(() => new CollectionAction.RemoveBookSuccessAction(book))
        .catch(() => of(new CollectionAction.RemoveBookFailAction(book)))
    );

  constructor(private actions$: Actions, private db: Database, private database: PouchDBService) {
    
    
  }
}
