import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/withLatestFrom';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { IAppState, getAnalyseData } from '../../ngrx/index';
import { AnalyseAction } from '../actions/index';
import { Data } from '../models/index';
import { AnalyseService } from '../services/index';

@Injectable()
export class AnalyseEffects {

  @Effect() analyse$ = this.actions$    
    .ofType(AnalyseAction.ActionTypes.ANALYSE)
    .map((action: AnalyseAction.Analyse) => action.payload)
    .withLatestFrom(this.store.let(getAnalyseData))
    .map((value: [string, Data]) => {
      console.log(value[0]);
      return this.analyseService.analyse(value[1]);
    })
    .map(result => new AnalyseAction.AnalyseSuccess(result))
    .catch((error) => {console.log(error);return of(new AnalyseAction.AnalyseFailure(error))})

  @Effect({ dispatch: false }) analyseSuccess$ = this.actions$
    .ofType(AnalyseAction.ActionTypes.ANALYSE_SUCCESS)
    .do(() => this.router.navigate(['/result']));


  constructor(
    private actions$: Actions,
    private analyseService: AnalyseService,
    private router: Router,
    private store: Store<IAppState>
  ) { }
}