
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
    .ofType<AnalyseAction.Redirect>(AnalyseAction.ActionTypes.REDIRECT)
    .pipe(
      exhaustMap(() => from(this.router.navigate(['/result']))),
      filter(moved => {console.log(moved);return moved}),
      map((moved) => {console.log(moved);return new AnalyseAction.Analyse("")})
    );

  @Effect() analyse$ = this.actions$
    .ofType<AnalyseAction.Analyse>(AnalyseAction.ActionTypes.ANALYSE)
    .pipe(
      tap(() => {console.log('/resulting')/*;this.store.dispatch(new LoaderAction.LoadingAction())*/}),
      tap(() => this.router.navigate(['/result'])),
      map((action: AnalyseAction.Analyse) => action.payload),
      withLatestFrom(this.store.select(getAnalyseData)),
      mergeMap((value: [string, Data]) => {console.log(value);return this.analyseService.analyse(value[1])}),
      map((result:Results) => {console.log(result);return new AnalyseAction.AnalyseSuccess(result)}),
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
    .pipe(
      tap(() => console.log("analyse ok"))
      //tap(() => this.store.dispatch(new LoaderAction.LoadedAction())),
      //tap(() => this.router.navigate(['/result']))
  );


  constructor(
    private actions$: Actions,
    private analyseService: AnalyseService,
    private router: Router,
    private store: Store<IAppState>
  ) { }
}