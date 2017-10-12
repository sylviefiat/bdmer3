import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { Injectable, NgZone } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Router } from '@angular/router';

import { of } from 'rxjs/observable/of';
import { SpeciesService } from "../services/species.service";

import { SpeciesAction } from '../actions/index';
import { Species } from '../models/species';

@Injectable()
export class SpeciesEffects {
  /**
   * This effect does not yield any actions back to the store. Set
   * `dispatch` to false to hint to @ngrx/effects that it should
   * ignore any elements of this effect stream.
   *
   * The `defer` observable accepts an observable factory function
   * that is called when the observable is subscribed to.
   * Wrapping the database open call in `defer` makes
   * effect easier to test.
   */
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => { 
    return this.database.initDB('species','http://entropie-dev:5984/');
  });

  @Effect()
  loadSpecies$: Observable<Action> = this.actions$
    .ofType(SpeciesAction.ActionTypes.LOAD)
    .switchMap(() =>     
      this.database
        .getAll()
        .map((species: Species[]) => new SpeciesAction.LoadSuccessAction(species))
        .catch(error => of(new SpeciesAction.LoadFailAction(error)))
    
    );

  @Effect()
  addSpeciesToList$: Observable<Action> = this.actions$
    .ofType(SpeciesAction.ActionTypes.ADD_SPECIES)
    .map((action: SpeciesAction.AddSpeciesAction) => action.payload)
    .mergeMap(species => 
      this.database
        .addSpecies(species)
        .map(() => new SpeciesAction.AddSpeciesSuccessAction(species))
        .catch(() => of(new SpeciesAction.AddSpeciesFailAction(species)))
    );

  @Effect()
  removeSpeciesFromList$: Observable<Action> = this.actions$
    .ofType(SpeciesAction.ActionTypes.REMOVE_SPECIES)
    .map((action: SpeciesAction.RemoveSpeciesAction) => action.payload)
    .mergeMap(species =>
      this.database
        .removeSpecies(species)
        .map(() => new SpeciesAction.RemoveSpeciesSuccessAction(species))
        .catch(() => of(new SpeciesAction.RemoveSpeciesFailAction(species)))
    );

   @Effect({ dispatch: false }) addSpeciesSuccess$ = this.actions$
    .ofType(SpeciesAction.ActionTypes.ADD_SPECIES_SUCCESS)
    .do(() =>this.router.navigate(['/countries']));

  @Effect({ dispatch: false }) removeSpeciesSuccess$ = this.actions$
    .ofType(SpeciesAction.ActionTypes.REMOVE_SPECIES_FAIL)
    .do(() =>this.router.navigate(['/countries']));

  constructor(private actions$: Actions, private router: Router, private db: Database, private database: SpeciesService) {
    
    
  }
}
