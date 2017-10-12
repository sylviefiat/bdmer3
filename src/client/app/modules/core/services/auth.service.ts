import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { Authenticate } from '../../auth/models/user';
import { CountriesService } from './countries.service';
import { User, Country } from '../../countries/models/country';
import { ResponsePDB } from '../models/pouchdb';
import * as PouchDB from "pouchdb";
import * as PouchDBAuth from "pouchdb-authentication";


@Injectable()
export class AuthService {
  public currentUser: /*Observable<*/User/*>*/;
  public currentCountry: /*Observable<*/Country/*>*/;
  private db: any;

  @Output() getLoggedInUser: EventEmitter<Observable<User>> = new EventEmitter();
  @Output() getCountry: EventEmitter<Observable<Country>> = new EventEmitter();

  constructor(private countriesService: CountriesService) {
    var pouchOpts = {
      skipSetup: true
    };
    this.db = new PouchDB('http://entropie-dev:5984/_users', pouchOpts);
  }

  login({ username, password }: Authenticate): Observable<any> {
    //console.log(username);
    return fromPromise(this.db.login(username, password))
      .filter((response: ResponsePDB) => response.ok)
      .map(response => {
        //console.log(response);
        this.getLoggedInUser.emit(this.countriesService.getUser(username));
        this.getCountry.emit(this.countriesService.getCountryUser(username));
        return response;
      })
      .mergeMap((response) => {
        return this.countriesService.getUser(username)
          .map(user => {
            this.currentUser = user;            
          });
      })
      .mergeMap((response) => {
        return this.countriesService.getCountryUser(username)
          .map(country => {
            this.currentCountry = country;
          })
        })
      .mergeMap((response) => {
        return of({user: this.currentUser, country: this.currentCountry});
      })
  }

  logout(): Observable<any> {
    return fromPromise(this.db.logout()) //(err, response) => {
      .filter((response: ResponsePDB) => response.ok)
      .map(response => {
        this.getLoggedInUser.emit(null);
        this.currentUser=null;
        return response;
      })
  }

  signup(user: User): Observable<any> {
    console.log(user.countryCode);
    let auth: Authenticate = { username: user.username, password: user.password, roles: [user.countryCode] };

    return of(user)
      .mergeMap(user =>
        fromPromise(this.db.signup(user.username, user.password, {metadata: {roles: [user.countryCode, user.role]}})))
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return of(user);
      })
  }

  remove(user): Observable<any> {
    return fromPromise(this.db.get("org.couchdb.user:"+user.username))
      .mergeMap(response => {
        return fromPromise(this.db.remove(response))
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return of(user);
      });
  }
}