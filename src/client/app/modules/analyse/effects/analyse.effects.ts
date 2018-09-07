
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { defer, Observable, pipe, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, tap, filter } from 'rxjs/operators';

import { IAppState, getAnalyseData, getSelectedCountry } from '../../ngrx/index';
import { AnalyseAction } from '../actions/index';
import { Data } from '../models/index';
import { AnalyseService } from '../services/index';
import { CountryAction } from '../../countries/actions/index';

@Injectable()
export class AnalyseEffects {

  @Effect() analyse$ = this.actions$ 
    .ofType<AnalyseAction.Analyse>(AnalyseAction.ActionTypes.ANALYSE)
    .pipe(
      map((action: AnalyseAction.Analyse) => action.payload),
      withLatestFrom(this.store.select(getAnalyseData)),
      map((value: [string, Data]) => AnalyseService.analyse(value[1])),
      map(result => new AnalyseAction.AnalyseSuccess(result)),
      catchError((error) => of(new AnalyseAction.AnalyseFailure(error)))
  );

  @Effect() setDefaultCountry$ = this.actions$
    .ofType<AnalyseAction.SetDefaultCountry>(AnalyseAction.ActionTypes.SET_DEFAULT_COUNTRY)
    .pipe(
      withLatestFrom(this.store.select(getSelectedCountry)),
      filter(value => value[1]),
      map(value => new AnalyseAction.SelectCountry(value[1]))
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