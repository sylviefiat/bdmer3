import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, of, from, pipe, throwError } from 'rxjs';
import { map, mergeMap, filter, catchError } from 'rxjs/operators';
import { Authenticate } from '../../auth/models/user';
import { CountriesService } from './countries.service';
import { User, Country } from '../../countries/models/country';

import { ResponsePDB } from '../models/pouchdb';
import * as PouchDB from 'pouchdb';
import * as PouchDBAuth from "pouchdb-authentication";

import { config } from '../../../config';

@Injectable()
export class AuthService {
  public currentUser: User;
  public currentCountry: Country;
  private db: any;

  @Output() getLoggedInUser: EventEmitter<Observable<User>> = new EventEmitter();
  @Output() getCountry: EventEmitter<Observable<Country>> = new EventEmitter();

  constructor(private countriesService: CountriesService) {
    let dbname = "/_users";
    PouchDB.plugin(PouchDBAuth);
    this.db = new PouchDB(config.urldb+dbname, {skip_setup: true});   
  }

  login({ username, password }: Authenticate): Observable<any> {
    return from(this.db.login(username, password)).pipe(
      mergeMap((result: ResponsePDB) => {
        if (result.ok /*&& result.roles.length > 0*/){
          return this.setUser(username);
        }
        else {
          return throwError(result); 
        }
      }));
  }

  session(): Observable<any> {
    return from(this.db.getSession()).pipe(
      mergeMap((result: ResponsePDB) => {
        if (result.ok && result.userCtx.name){
          return this.setUser(result.userCtx.name);
        }
        else{
          return throwError(result); 
        }
      }));
  }

  setUser(username): Observable<any>{
    return this.countriesService.getUser(username).pipe(
      map(user => {
        this.currentUser = user;
        this.getLoggedInUser.emit(of(this.currentUser));        
        return of(this.currentUser);    
      }),
      mergeMap(() => {
        return this.countriesService.getCountryUser(username)
          .pipe(
            map(country => {
              this.currentCountry = country;
              this.getCountry.emit(of(this.currentCountry));
              return of(this.currentCountry);
            }))
        }),
      mergeMap((response) => {
        return of({user: this.currentUser, country: this.currentCountry});
      })
    )
  }

  logout(): Observable<any> {
    return from(this.db.logout()).pipe(
      filter((response: ResponsePDB) => response.ok),
      map(response => {
        this.getLoggedInUser.emit(null);
        this.currentUser=null;
        return response;
      })
    )
  }

  signup(user: User): Observable<any> {
    return from(
      this.db.signup(user.username, user.password, {
        metadata: {
          rights: user.role,
          country: user.countryCode
        }
      },(err,response)=>{
        if(err){
          throwError(err)
        }
        return of(user);
      }))
  }

  remove(user): Observable<any> {
    return from(this.db.get("org.couchdb.user:"+user.username)).pipe(
      mergeMap(response => from(this.db.remove(response))),
      filter((response: ResponsePDB) => { return response.ok; }),
      mergeMap((response) => of(user)));
  }

  public sync(local: string): Promise<any> {
    let localDatabase = new PouchDB(local);
    return this.db.sync(localDatabase, {
      live: true,
      retry: true
    }).on('error', error => {
      console.error(JSON.stringify(error));
    });
  }
}