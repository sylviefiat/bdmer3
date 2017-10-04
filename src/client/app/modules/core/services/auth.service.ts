import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { Authenticate } from '../../auth/models/user';
import { CountriesService } from './countries.service';
import { User, Country } from '../../countries/models/country';
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

  login({ username, password }: Authenticate): Observable<User> {  
    console.log(username);
    return fromPromise(this.db.login(username, password, (err, response) => {
      
      if (err) {
        if (err.name === 'unauthorized') {
          console.log(err);
          return of(_throw('Invalid username or password'));
        } else {
          console.log(err);
          return of(_throw(err.reason));
        }
      }
      this.currentUser = this.countriesService.getUser(username);
      console.log(this.currentUser);
      this.currentUser.subscribe(user => {
        this.currentCountry = this.countriesService.getCountry(user.countryCode);
      });  
      this.getLoggedInUser.emit(this.currentUser);
      this.getCountry.emit(this.currentCountry);
      return this.currentUser;
    }));
  }

  logout(): Observable<any> {
    return fromPromise(this.db.logout((err, response) => {
      if (err) {
        return of(_throw(err.reason));
      }
      this.currentUser = of({ _id: null, nom: null, prenom: null, username: null, email: null, countryCode: null});
      this.getLoggedInUser.emit(this.currentUser);
      return of(response.ok);
    }));
  }

  signup({ username, password }: Authenticate): Observable<any> {
    return fromPromise(this.db.signup(username, password, (err, response) => {
      if (err) {
        if (err.name === 'conflict') {
          return of(_throw('Invalid username or password'));
        } else if (err.name === 'forbidden') {
          return of(_throw('User name already exists'));
        } else {
          return of(_throw(err.reason));
        }
      }
      return of(response.ok);
    }));
  }
}