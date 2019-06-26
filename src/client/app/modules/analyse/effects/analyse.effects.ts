
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { defer, Observable, pipe, of, from } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom, tap, filter, mergeMap, exhaustMap } from 'rxjs/operators';

import { IAppState, getAnalyseData, getSelectedCountry } from '../../ngrx/index';
import { AnalyseAction } from '../actions/index';
import { Data, Results } from '../models/index';
import { AnalyseService } from '../services/index';
import { CountryAction } from '../../countries/actions/index';
import { LoaderAction } from "../../core/actions/index";

@Injectable()
export class AnalyseEffects {

  @Effect() redirectToResults$ = this.actions$
    .pipe(
      ofType<AnalyseAction.Redirect>(AnalyseAction.ActionTypes.REDIRECT),
      tap(() => this.store.dispatch(new LoaderAction.LoadingAction())),
      exhaustMap(() => from(this.router.navigate(['/result']))),
      filter(moved => moved),
      map((moved) => new AnalyseAction.Analyse(""))
    );

  @Effect() analyse$ = this.actions$
    .pipe(
      ofType<AnalyseAction.Analyse>(AnalyseAction.ActionTypes.ANALYSE),
      map((action: AnalyseAction.Analyse) => action.payload),
      withLatestFrom(this.store.select(getAnalyseData)),
      mergeMap((value: [string, Data]) => this.analyseService.analyse(value[1])),
      map((result:Results) => new AnalyseAction.AnalyseSuccess(result)),
      catchError((error) => of(new AnalyseAction.AnalyseFailure(error)))
  );

  @Effect() setDefaultCountry$ = this.actions$
    .pipe(
      ofType<AnalyseAction.SetDefaultCountry>(AnalyseAction.ActionTypes.SET_DEFAULT_COUNTRY),
      withLatestFrom(this.store.select(getSelectedCountry)),
      filter(value => value[1]),
      map(value => new AnalyseAction.SelectCountry(value[1]))
    );

  @Effect({ dispatch: false }) analyseSuccess$ = this.actions$
    .pipe(
      ofType<AnalyseAction.AnalyseSuccess>(AnalyseAction.ActionTypes.ANALYSE_SUCCESS),
      tap(() => this.store.dispatch(new LoaderAction.LoadedAction())),
      tap(() => console.log("analyse ok"))
  );


  constructor(
    private actions$: Actions,
    private analyseService: AnalyseService,
    private router: Router,
    private store: Store<IAppState>
  ) { }
}