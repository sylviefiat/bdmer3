import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { defer, Observable, pipe, of, from } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType, EffectNotification, OnRunEffects } from '@ngrx/effects';
import { catchError, switchMap, map, withLatestFrom, startWith, tap, exhaustMap, takeUntil } from 'rxjs/operators';

import { IAppState, getLatestURL } from '../../ngrx/index';
import { CountriesService, MailService } from '../../core/services/index';
import { AppInitAction } from '../actions/index';
import { environment } from '../../../config';

@Injectable()
export class AppInitEffects implements OnRunEffects {

    @Effect() ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>): Observable<EffectNotification> {
        return this.actions$
            .pipe(
                ofType<AppInitAction.StartAppInitAction>(AppInitAction.ActionTypes.START_APP_INIT),
                exhaustMap(() => resolvedEffects$
                    .pipe(
                        takeUntil(this.actions$
                                    .pipe(ofType<AppInitAction.FinishAppInitAction>(AppInitAction.ActionTypes.FINISH_APP_INIT)))
                    )
                )
            );
    }

    @Effect() loadServicesUrl$ = this.actions$
        .pipe(
            ofType<AppInitAction.LoadServicesUrlAction>(AppInitAction.ActionTypes.LOAD_SERVICES_URL),
            switchMap(action => this.http.get('assets/app-config.json')),
            map(result => new AppInitAction.ServicesUrlLoadedAction(result)),
            catchError(error => of(new AppInitAction.ServicesUrlLoadedAction(environment)))
        );


    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private store: Store<IAppState>
    ) { }
}