
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { defer, Observable, pipe, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, tap } from 'rxjs/operators';

import { IAppState, getAnalyseData } from '../../ngrx/index';
import { AnalyseAction } from '../actions/index';
import { Data } from '../models/index';
import { AnalyseService } from '../services/index';

@Injectable()
export class AnalyseEffects {

  @Effect() analyse$ = this.actions$ 
    .ofType<AnalyseAction.Analyse>(AnalyseAction.ActionTypes.ANALYSE)
    .pipe(
      map((action: AnalyseAction.Analyse) => action.payload),
      withLatestFrom(this.store.select(getAnalyseData)),
      map((value: [string, Data]) => this.analyseService.analyse(value[1])),
      map(result => new AnalyseAction.AnalyseSuccess(result)),
      catchError((error) => of(new AnalyseAction.AnalyseFailure(error)))
  );

  @Effect({ dispatch: false }) analyseSuccess$ = this.actions$
    .ofType<AnalyseAction.AnalyseSuccess>(AnalyseAction.ActionTypes.ANALYSE_SUCCESS)
    .pipe(tap(() => this.router.navigate(['/result']))
  );


  constructor(
    private actions$: Actions,
    private analyseService: AnalyseService,
    private router: Router,
    private store: Store<IAppState>
  ) { }
}