import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Store } from '@ngrx/store';

import { IAppState, getCountry } from '../../ngrx/index';

import * as PouchDB from "pouchdb";
import { PouchDBService } from "../../core/services/pouchdb.service";
import { User, Country } from '../../countries/models/country';

@Injectable()
export class CountriesService {
  public currentCountry: Country;
  public currentUser: User;

  constructor(private store: Store<IAppState>, private database: PouchDBService) {   
    this.database.initDB('countries','http://entropie-dev:5984/');   
  }  

  getAll() : Observable<any> {  
  	return this.database.getAll();
  }

  getUser(username: string): Observable<any> {
    return this.database.query(this.userMapFunction, {
      key: username, 
      include_docs: true
    }).take(1);
  }

  getCountry(countryname: string): Observable<Country> {
    return this.database.query(this.countryMapFunction, {
      key: countryname, 
      include_docs: true
    }).take(1);
  }

  addCountry(country: Country) : Promise<any> {
  	return this.database.add(country);
  }

  removeCountry(country: Country) : Promise<any>{
  	return this.database.delete(country);
  }

  addUser(user: User) : Observable<any> {
  	return this.store.let(getCountry).
  		map(country => {
  			console.log(country);        
      	return this.database.get(country).map((doc) => {
      		console.log(doc);
          user.country=doc.countryInfo.name;
      		doc.users[doc.users.length] = user;
      		return this.database.update(doc);
      	});
      });
    
  }

  removeUser(user: User) : Observable<any> {
  	return this.store.let(getCountry).map(country => {
  		console.log(country);
      return this.database.get(country).map((doc) => {
      	console.log(doc);
      	doc.users = doc.users.filter(id => id !== user.id);
      	return this.database.update(doc);
      })
    });
  }

  userMapFunction(doc) {
    doc.users.forEach(function (user) {
      PouchDB.emit(user.username);
    });
  }

  countryMapFunction(doc) {
    PouchDB.emit(doc.countryInfo.name);
  }
}