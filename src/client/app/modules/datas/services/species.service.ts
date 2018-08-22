import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, from, pipe, of } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

import * as PouchDB from "pouchdb";
import { ResponsePDB } from '../../core/models/pouchdb';
import { Species } from '../models/species';

@Injectable()
export class SpeciesService {
  private currentSpecies: Observable<Species>;
  private db: any;

  constructor() {
    //this.dbname = "species";
  }

  initDB(dbname,remote): Observable<any> {
    this.db = new PouchDB(dbname,{revs_limit: 3});
    return from(this.sync(remote + "/"  + dbname));
  }

  public getAll(): Observable<any> {
   return from(this.db.allDocs({ include_docs: true }))
      .pipe(map((result: ResponsePDB) => result.rows.map(row => row.doc)));
    }

  getSpecies(speciesCode: string): Observable<Species> {
    return from(this.db.query(function(doc, emit) {
      emit(doc.code);
    }, { key: speciesCode, include_docs: true }))
    .pipe(map((result: ResponsePDB) => result.rows && result.rows[0] && result.rows[0].doc));
  }

  addSpecies(species: Species): Observable<Species> {
    species._id=species.code;
    console.log(species);
    return from(this.db.put(species))
      .pipe(
        filter((response: ResponsePDB) =>response.ok),
        mergeMap(response => of(species))
      );
  }

  importSpecies(species: Species[]): Observable<Observable<Species>> {
    console.log(species);
    return of(species)
      .map((sp, i) => this.addSpecies(sp[i]))
  }

  editSpecies(species: Species): Observable<Species> {
    species._id=species.code;
    console.log(species);
    return this.getSpecies(species.code)
      .pipe(
        mergeMap(sp => {    
          if(sp) {species._rev = sp._rev;}
          return from(this.db.put(species));
        }),
        filter((response: ResponsePDB) => response.ok),
        mergeMap((response) => of(species))
      );
  }

  removeSpecies(species: Species): Observable<Species> {  
    return from(this.db.remove(species))
      .pipe(
        filter((response: ResponsePDB) => response.ok),
        mergeMap(response => of(species))
      );
  }


  public sync(remote: string): Promise<any> {
    let remoteDatabase = new PouchDB(remote);
    return this.db.sync(remoteDatabase, {
      live: true,
      retry: true
    }).on('error', error => {
      console.error(JSON.stringify(error));
    });
  }
}