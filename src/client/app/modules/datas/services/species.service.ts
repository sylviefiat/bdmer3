import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';


import * as PouchDB from "pouchdb";
import { ResponsePDB } from '../../core/models/pouchdb';
import { Species } from '../models/species';

@Injectable()
export class SpeciesService {
  private currentSpecies: Observable<Species>;
  private db: any;

  constructor(private http: Http) {
  }

  initDB(dbname: string, remote: string): Observable<any> {
    this.db = new PouchDB(dbname);
    return fromPromise(this.sync(remote + dbname));
  }

  public getAll(): Observable<any> {
    return fromPromise(
      this.db.allDocs({ include_docs: true })
        .then(docs => {
          return docs.rows.map(row => {
            return row.doc;
          });
        }));
  }

  getSpecies(speciesCode: string): Observable<Species> {
    return fromPromise(this.db.query(function(doc, emit) {
      emit(doc.code);
    }, { key: speciesCode, include_docs: true }))
    .map((result: ResponsePDB) => {
      return result.rows && result.rows[0] && result.rows[0].doc;
    
    })
  }

  addSpecies(species: Species): Observable<Species> {
    species._id=species.code;
    return fromPromise(this.db.put(species))
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(species);
      })
  }

  importSpecies(species: Species[]): Observable<Observable<Species>> {
    return of(species)
      .map((sp, i) => this.addSpecies(sp[i]))
  }

  editSpecies(species: Species): Observable<Species> {
    species._id=species.code;
    return this.getSpecies(species.code)
      .mergeMap(sp => {    
        if(sp) {species._rev = sp._rev;}
        return fromPromise(this.db.put(species));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return of(species);
      })
  }

  removeSpecies(species: Species): Observable<Species> {    
    return fromPromise(this.db.remove(species))
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(species);
      })
  }

  /*getDimensions(countryCode: string, speciesCode): Observable<Species> {
    return fromPromise(this.db.query(function(doc, emit) {
      doc.dimensions && doc.dimensions.forEach(function(dim) {
        emit(dim.codeCountry, dim.codeSpecies);
      });
    }, { key: {countryCode,speciesCode}, include_docs: true }))
    .map((result: ResponsePDB) => {
      return result.rows && result.rows[0] && result.rows[0].doc && result.rows[0].doc.dimensions &&
        result.rows[0].doc.dimensions.filter(dim => dim.codeSpecies === speciesCode) && 
        result.rows[0].doc.dimensions.filter(dim => dim.codeSpecies === speciesCode).filter(dim => dim.codeCountry === countryCode) &&
        result.rows[0].doc.dimensions.filter(dim => dim.codeSpecies === speciesCode).filter(dim => dim.codeCountry === countryCode)[0];
    })
  }

  addDimensions(dimensions: Dimensions): Observable<Species> {
    return this.getSpecies(dimensions.codeSpecies)
      .mergeMap(species => {
        if (species.dimensions === null) {
          species.dimensions = [];
        }
        species.dimensions[species.dimensions.length] = dimensions;
        this.currentSpecies= of(species);
        return fromPromise(this.db.put(species));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return this.currentSpecies;
      })
  }

  removeDimmensions(dimensions: Dimensions): Observable<Species> {
    return this.getSpecies(dimensions.codeSpecies)
      .mergeMap(species => {
        this.currentSpecies = of(species);
        species.dimensions = species.dimensions.filter(dim => { return dimensions._id !== dim._id; });
        return fromPromise(this.db.put(species));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return this.currentSpecies;
      })
  }*/

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