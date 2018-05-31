// angular
import { Injectable } from '@angular/core';

// libs
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MainEffects {

  

  constructor(
    private store: Store<any>,
    private actions$: Actions
  ) { }
}
