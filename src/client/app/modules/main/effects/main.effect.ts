// angular
import { Injectable } from '@angular/core';

// libs
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

// module
import { NameListService } from '../services/name-list.service';
import { NameList } from '../actions/index';

@Injectable()
export class MainEffects {

  

  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private nameListService: NameListService
  ) { }
}
