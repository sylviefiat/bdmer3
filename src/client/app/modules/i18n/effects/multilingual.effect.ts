// angular
import { Injectable, Inject } from '@angular/core';

// libs
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import * as Lodash from 'lodash';
import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators/map';

// module
import { MultilingualService, Languages } from '../services/multilingual.service';
import * as multilingual from '../actions/multilingual.action';
import { MultilingualAction } from '../actions/multilingual.action';

@Injectable()
export class MultilingualEffects {

  @Effect() change$: Observable<Action> = this.actions$
    .ofType(MultilingualAction.ActionTypes.CHANGE)
    .map((action: MultilingualAction.ChangeAction) => {
      let lang = action.payload;
      if (Lodash.includes(Lodash.map(this.languages, 'code'), lang)) {
        let langChangedAction = new MultilingualAction.LangChangedAction(lang);
        // change state
        return new MultilingualAction.LangChangedAction(lang);
      } else {
        // not supported (here for example)
        return new MultilingualAction.LangUnsupportedAction(lang);
      }
    });

  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private multilangService: MultilingualService,
    @Inject(Languages) private languages
  ) { }
}
