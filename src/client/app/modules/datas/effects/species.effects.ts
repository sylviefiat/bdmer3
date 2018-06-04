
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, defer, pipe, of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom, switchMap, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Csv2JsonService } from "../../core/services/csv2json.service";
import { SpeciesService } from "../services/species.service";
import { SpeciesAction } from '../actions/index';
import { Species } from '../models/species';

import { config } from '../../../config';

@Injectable()
export class SpeciesEffects {
  
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => { 
    return this.speciesService.initDB('species',config.urldb);
  });

  @Effect()
  loadSpecies$: Observable<Action> = this.actions$.pipe(
    ofType<SpeciesAction.LoadAction>(SpeciesAction.ActionTypes.LOAD),
    switchMap(() => this.speciesService.getAll()),
    map((species: Species[]) => new SpeciesAction.LoadSuccessAction(species)),
    catchError(error => of(new SpeciesAction.LoadFailAction(error)))
    );

  @Effect()
  addSpeciesToList$: Observable<Action> = this.actions$.pipe(
    ofType<SpeciesAction.AddSpeciesAction>(SpeciesAction.ActionTypes.ADD_SPECIES),
    map((action: SpeciesAction.AddSpeciesAction) => action.payload),
    mergeMap(species => this.speciesService.editSpecies(species)),
    map((species: Species) => new SpeciesAction.AddSpeciesSuccessAction(species)),
    catchError((error) => of(new SpeciesAction.AddSpeciesFailAction(error)))
    );

  @Effect()
  importSpeciesToList$: Observable<Action> = this.actions$.pipe(
    ofType<SpeciesAction.ImportSpeciesAction>(SpeciesAction.ActionTypes.IMPORT_SPECIES),
    map((action: SpeciesAction.ImportSpeciesAction) => action.payload),
    mergeMap(speciesCsv => this.csv2jsonService.csv2('species',speciesCsv)),
    mergeMap((species) => this.speciesService.editSpecies(species)),
    map((species: Species) => new SpeciesAction.ImportSpeciesSuccessAction(species)),
    catchError((error) => of(new SpeciesAction.AddSpeciesFailAction(error)))    
    );

  @Effect()
  removeSpeciesFromList$: Observable<Action> = this.actions$.pipe(
    ofType<SpeciesAction.RemoveSpeciesAction>(SpeciesAction.ActionTypes.REMOVE_SPECIES),
    map((action: SpeciesAction.RemoveSpeciesAction) => action.payload),
    mergeMap(species => this.speciesService.removeSpecies(species)),
    map((species) => new SpeciesAction.RemoveSpeciesSuccessAction(species)),
    catchError((species) => of(new SpeciesAction.RemoveSpeciesFailAction(species)))
    );

   @Effect({ dispatch: false }) addSpeciesSuccess$ = this.actions$.pipe(
    ofType<SpeciesAction.AddSpeciesSuccessAction>(SpeciesAction.ActionTypes.ADD_SPECIES_SUCCESS),
    map((action: SpeciesAction.AddSpeciesSuccessAction) => action.payload),
    mergeMap((species) =>this.router.navigate(['/species/'+species._id])));

  @Effect({ dispatch: false }) removeSpeciesSuccess$ = this.actions$.pipe(
    ofType<SpeciesAction.RemoveSpeciesSuccessAction>(SpeciesAction.ActionTypes.REMOVE_SPECIES_SUCCESS),
    tap(() =>this.router.navigate(['/species'])));

  constructor(private actions$: Actions, private router: Router, private speciesService: SpeciesService, private csv2jsonService: Csv2JsonService) {
    
    
  }
}
