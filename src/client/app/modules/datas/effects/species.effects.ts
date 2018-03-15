import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';

import { Csv2JsonService } from "../../core/services/csv2json.service";
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
    return this.speciesService.initDB('species','http://bdmerdb:5984/');
  });

  @Effect()
  loadSpecies$: Observable<Action> = this.actions$
    .ofType(SpeciesAction.ActionTypes.LOAD)
    .switchMap(() =>     
      this.speciesService
        .getAll()
        .map((species: Species[]) => new SpeciesAction.LoadSuccessAction(species))
        .catch(error => of(new SpeciesAction.LoadFailAction(error)))
    
    );

  @Effect()
  addSpeciesToList$: Observable<Action> = this.actions$
    /*.do((action) => console.log(`Received ${action.type}`))
    .filter((action) => action.type === SpeciesAction.ActionTypes.ADD_SPECIES)*/
    .ofType(SpeciesAction.ActionTypes.ADD_SPECIES)
    .map((action: SpeciesAction.AddSpeciesAction) => action.payload)
    .mergeMap(species => 
      this.speciesService
        .editSpecies(species)
        .map((species: Species) => new SpeciesAction.AddSpeciesSuccessAction(species))
        .catch((error) => {console.log(error);return of(new SpeciesAction.AddSpeciesFailAction(error))})
    );

  @Effect()
  importSpeciesToList$: Observable<Action> = this.actions$
    /*.do((action) => console.log(`Received ${action.type}`))
    .filter((action) => action.type === SpeciesAction.ActionTypes.IMPORT_SPECIES)*/
    .ofType(SpeciesAction.ActionTypes.IMPORT_SPECIES)
    .map((action: SpeciesAction.ImportSpeciesAction) => action.payload)
    .mergeMap(speciesCsv => this.csv2jsonService.csv2('species',speciesCsv))
    .mergeMap((species) => {
      return this.speciesService
        .editSpecies(species)
      })
    .map((species: Species) => new SpeciesAction.ImportSpeciesSuccessAction(species))
    .catch((error) => {console.log(error);return of(new SpeciesAction.AddSpeciesFailAction(error))})
    
    ;

  @Effect()
  removeSpeciesFromList$: Observable<Action> = this.actions$
    .ofType(SpeciesAction.ActionTypes.REMOVE_SPECIES)
    .map((action: SpeciesAction.RemoveSpeciesAction) => action.payload)
    .mergeMap(species =>
      this.speciesService
        .removeSpecies(species)
        .map(() => new SpeciesAction.RemoveSpeciesSuccessAction(species))
        .catch(() => of(new SpeciesAction.RemoveSpeciesFailAction(species)))
    );

   @Effect({ dispatch: false }) addSpeciesSuccess$ = this.actions$
    .ofType(SpeciesAction.ActionTypes.ADD_SPECIES_SUCCESS)
    .map((action: SpeciesAction.AddSpeciesSuccessAction) => action.payload)
    .mergeMap((species) =>this.router.navigate(['/species/'+species._id]));

  @Effect({ dispatch: false }) removeSpeciesSuccess$ = this.actions$
    .ofType(SpeciesAction.ActionTypes.REMOVE_SPECIES_SUCCESS)
    .do(() =>this.router.navigate(['/species']));

  constructor(private actions$: Actions, private router: Router, private speciesService: SpeciesService, private csv2jsonService: Csv2JsonService) {
    
    
  }
}
