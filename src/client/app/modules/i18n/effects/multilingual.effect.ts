// angular
import { Injectable, Inject } from '@angular/core';

// libs
import { defer, Observable, pipe, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as Lodash from 'lodash';
//import 'rxjs/add/operator/map';

// module
import { MultilingualService, Languages } from '../services/multilingual.service';
import { MultilingualAction } from '../actions/multilingual.action';

@Injectable()
export class MultilingualEffects {


  @Effect() change$: Observable<Action> = this.actions$
    .ofType<MultilingualAction.ChangeAction>(MultilingualAction.ActionTypes.CHANGE)
    .pipe(
      map((action: MultilingualAction.ChangeAction) => action.payload),
      mergeMap((lang:string) => {
        if (Lodash.includes(Lodash.map(this.languages, 'code'), lang)) {
          let langChangedAction = new MultilingualAction.LangChangedAction(lang);
          // change state
          return of(new MultilingualAction.LangChangedAction(lang));
        } else {
          // not supported (here for example)
          return of(new MultilingualAction.LangUnsupportedAction(lang));
        }
      })
    );

  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private multilangService: MultilingualService,
    @Inject(Languages) private languages
  ) { }
  
  @Effect({ dispatch: false })
  configure$: Observable<any> = defer(() => { 
    return this.multilangService.initLanguage();
  });
}
