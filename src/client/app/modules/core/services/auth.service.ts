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
  public currentUser: Observable<User>;
  public currentCountry: Observable<Country>;
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
      .mergeMap(() => {
        this.currentUser = this.countriesService.getUser(username);
        this.currentCountry = this.countriesService.getCountryUser(username);
        this.getLoggedInUser.emit(this.currentUser);
        this.getCountry.emit(this.currentCountry);
        return this.currentUser;
      })
      .catch(err => {
        if (err.name === 'unauthorized') {
          console.log(err);
          return of(_throw('Invalid username or password'));
        }
        console.log(err);
        return of(_throw(err.reason));
      })
  }

  logout(): Observable<any> {
    return fromPromise(this.db.logout((err, response) => {
      if (err) {
        return of(_throw(err.reason));
      }
      this.currentUser = null;
      this.getLoggedInUser.emit(this.currentUser);
      return of(response.ok);
    }));
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
      .catch(err => {
        if (err.name === 'conflict') {
          return of(_throw('Invalid username or password'));
        } else if (err.name === 'forbidden') {
          return of(_throw('User name already exists'));
        }
        return of(_throw(err.reason));
      }
      );
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