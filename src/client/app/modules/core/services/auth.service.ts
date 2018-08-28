import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, of, from, pipe, throwError } from 'rxjs';
import { map, mergeMap, filter, catchError } from 'rxjs/operators';
import { Authenticate } from '../../auth/models/user';
import { CountriesService } from './countries.service';
import { User, Country } from '../../countries/models/country';

import { ResponsePDB } from '../models/pouchdb';
import * as PouchDB from 'pouchdb';
import * as PouchDBAuth from "pouchdb-authentication";
import {TranslateService} from '@ngx-translate/core';

import { AppService } from './app.service';

@Injectable()
export class AuthService {
  public currentUser: User;
  public currentCountry: Country;
  private db: any;

  @Output() getLoggedInUser: EventEmitter<Observable<User>> = new EventEmitter();
  @Output() getCountry: EventEmitter<Observable<Country>> = new EventEmitter();

  constructor(private environment: AppService, private translate: TranslateService, private countriesService: CountriesService) {

  }

  initDB(dbname,remote): Observable<any> {
    PouchDB.plugin(PouchDBAuth);
    console.log(remote + "/" + dbname);
    this.db = new PouchDB(remote + "/" + dbname, {skip_setup: true,revs_limit: 5}); 
    return from(this.sync(remote + "/"  + dbname));
  }

  login({ username, password }: Authenticate): Observable<any> {
    console.log(username);
    console.log(password);
    return from(this.db.login(username, password)).pipe(
      mergeMap((result: ResponsePDB) => {
        console.log(result);
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
            if (err.name === 'conflict') {
              throwError(this.translate.instant(''))
            } else if (err.name === 'forbidden') {
              throwError(err)
            } else {
            throwError(err);
          }
        }
      })).pipe(
        map(r=> user)
      )
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