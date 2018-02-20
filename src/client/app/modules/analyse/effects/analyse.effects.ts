import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { IAppState } from '../../ngrx/index';
import { AnalyseAction } from '../actions/index';
import { AnalyseService } from '../services/index';

@Injectable()
export class AnalyseEffects {

  @Effect() analyse$ = this.actions$
    .ofType(AnalyseAction.ActionTypes.ANALYSE)
    .map((action: AnalyseAction.Analyse) => action.payload)
    .map(analyseState => {
      return this.analyseService.analyse(analyseState);
    })
    .map(result => new AnalyseAction.AnalyseSuccess(result))
    .catch((error) => of(new AnalyseAction.AnalyseFailure(error)))

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