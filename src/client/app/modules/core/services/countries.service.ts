import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, from, of, pipe, throwError } from 'rxjs';
import { map, mergeMap, filter, catchError } from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

import * as PouchDB from "pouchdb";
import { User, Country } from '../../countries/models/country';
import { ResponsePDB } from '../models/pouchdb';
import { Authenticate } from '../../auth/models/user';

@Injectable()
export class CountriesService {
  public currentCountry: Observable<Country>;
  public currentUser: Observable<User>;
  public adminUser = { _id: 'admin', name: 'admin', surname: 'ad', username: 'admin', email: null, countryCode: 'AA', password: null, role: 'EDITOR' };
  public adminCountry: Country = { _id: 'AA', code: 'AA', name: 'Administrators', users: null, coordinates: {lat: null, lng:null }, flag: null };

  private db: any;

  constructor(private translate: TranslateService) {
  }

  initDB(dbname: string, remote: string): Observable<any> {
    this.db = new PouchDB(dbname, {skip_setup: true});
    this.sync(remote + dbname);
    return this.getCountry(this.adminCountry.code).pipe(
      filter(country => !country),
      mergeMap(() =>
        this.insertCountry(this.adminCountry).pipe(
          mergeMap(country => this.addUser(this.adminUser)))
      )
    )
  }

  public getAll(): Observable<any> {
   return from(this.db.allDocs({ include_docs: true })).pipe(
      map((result: ResponsePDB) => 
        result.rows.map(row => row.doc)
      ))
  }


  getCountry(countrycode: string): Observable<Country> {
    return from(this.db.query(function(doc, emit) {
      emit(doc.code);
    }, { key: countrycode, include_docs: true, attachments: true, binary: true }))
      .pipe(map((result: ResponsePDB) => {
        return result.rows && result.rows[0] && result.rows[0].doc;

      }))
  }

  insertCountry(country: Country): Observable<Country> {
    this.currentCountry = of(country);
    return this.getCountry(country.code).pipe(
      filter((response) => !response),
      mergeMap(response => from(this.db.put(country))),
      filter((response: ResponsePDB) => response.ok),
      mergeMap(response => this.currentCountry)
    );
  }

  addCountry(countryJson: any): Observable<Country> {
    let country = countryJson.pays;
    let fullCountry: Country = { _id: country.code, code: country.code, name: country.name, flag: countryJson.flag, coordinates: {lat: countryJson.coordinates.lat, lng: countryJson.coordinates.lng},users: null }
    this.currentCountry = of(fullCountry);

    return from(this.db.put(fullCountry))
  }

  removeCountry(country: Country): Observable<Country> {
    this.currentCountry = of(country);
    return of(country).pipe(
      mergeMap(country => from(this.db.remove(country))),
      filter((response: ResponsePDB) => { return response.ok; }),
      mergeMap(response => this.currentCountry)
    );
  }

  getUser(uname: string): Observable<User> {
    console.log(this.db);
    return from(this.db.query(function(doc, emit){
      doc.users && doc.users.forEach(function(user){
        emit(user.username);
      });
    }, { key: uname, include_docs: true }))   
      .pipe(map((result: ResponsePDB) =>  result.rows && result.rows[0] && result.rows[0].doc && result.rows[0].doc.users &&
          result.rows[0].doc.users.filter(user => user.username === uname) && result.rows[0].doc.users.filter(user => user.username === uname)[0])
       );
  }

  getCountryUser(username: string): Observable<Country> {
    return from(this.db.query(function(doc, emit) {
      doc.users && doc.users.forEach(function(user) {
        emit(user.username);
      });
    }, { key: username, include_docs: true, attachments: true, binary: true }))
      .pipe(map((result: ResponsePDB) => result.rows && result.rows[0] && result.rows[0].doc));
  }

  getMailUser(email: string): Observable<User> {
    return from(this.db.query(function(doc, emit) {
      doc.users && doc.users.forEach(function(user) {
        emit(user.email);
      });
    }, { key: email, include_docs: true }))
      .pipe(map((result: ResponsePDB) => result.rows && result.rows[0] && result.rows[0].doc && result.rows[0].doc.users &&
          result.rows[0].doc.users.filter(user => user.email === email) && result.rows[0].doc.users.filter(user => user.email === email)[0]));
  }

  addUser(user: User): Observable<Country> {
    console.log(user);
    delete user.password;
    delete user.repassword;
    return this.getCountry(user.countryCode).pipe(
      mergeMap(country => {
        this.currentCountry = of(country);
        if (country.users === null) {
          country.users = [];
        }
        country.users[country.users.length] = user;
        console.log(country);
        return from(this.db.put(country));
      }),
      filter((response: ResponsePDB) => { return response.ok; }),
      mergeMap((response) => {
        return this.currentCountry;
      }));
  }

  removeUser(user: User): Observable<Country> {
    return this.getCountry(user.countryCode).pipe(
      mergeMap(country => {
        this.currentCountry = of(country);
        country.users = country.users.filter(users => { return users.username !== user.username; });
        return from(this.db.put(country));
      }),
      filter((response: ResponsePDB) => { return response.ok; }),
      mergeMap((response) => this.currentCountry)
    );
  }

  verifyMail(email: string): Observable<any> {
    let msg = this.translate.instant('EMAIL_ERROR');
    return this.getMailUser(email).pipe(
      filter(answer => answer && answer._id && answer._id.length > 0),
      map((user) => user),
      catchError(e => throwError(msg.EMAIL_ERROR))
    )
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