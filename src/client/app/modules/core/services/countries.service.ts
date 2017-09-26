import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Store } from '@ngrx/store';

import { IAppState, getCountry } from '../../ngrx/index';

import * as PouchDB from "pouchdb";
import { User, Country } from '../../countries/models/country';

@Injectable()
export class CountriesService {
  public currentCountry: Country;
  public currentUser: User;

  private db: any;

  constructor(private store: Store<IAppState>) { 
    /*this.db = new PouchDB('countries');
    this.sync('http://entropie-dev:5984/countries'); */
  }  

  initDB(dbname: string, remote : string) : Promise<any> {
        this.db = new PouchDB(dbname);
        return this.sync(remote+dbname);
  }

  public getAll() : Observable<any> {  
  //console.log("getall !");      
        return fromPromise(
            this.db.allDocs({ include_docs: true })
                .then(docs => {
                    return docs.rows.map(row => {
                        return row.doc;
                    });
                }));
    }


  getUser(username: string): Observable<any> {
    return this.db.query(this.userMapFunction, {
      key: username, 
      include_docs: true
    });
  }

  getCountry(countryname: string): Observable<Country> {
    return this.db.query(this.countryMapFunction, {
      key: countryname, 
      include_docs: true
    });
  }

  addCountry(pays: any) : Promise<any> { 
  console.log(pays);  
  console.log(pays.pays.flag);  
  return this.db.put({
    code: pays.pays.code,
    name: pays.pays.name,
    flag: {
      _attachments: {
       flag: {
         type: pays.pays.flag._attachments.flag.type,
         data: pays.pays.flag._attachments.flag.data
       }
     }
   }
  }).catch(function (err) {
    console.log(err);
  });
  	//return this.db.post(country);
  }

  removeCountry(country: Country) : Promise<any>{
  	return this.db.remove(country);
  }

  addUser(user: User) : /*Observable<*/any/*>*/ {
    console.log(this.store);
  	/*return this.store.let(getActualCountry).
  		map(country => {
  			console.log(country);        
      	return this.database.get(country).map((doc) => {
      		console.log(doc);
          user.country=doc.countryInfo.name;
      		doc.users[doc.users.length] = user;
      		return this.database.update(doc);
      	});
      })*/;
    
  }

  removeUser(user: User) : /*Observable<*/any/*>*/ {
    console.log(this.store);
  	/*return this.store.let(getCountry).map(country => {
  		console.log(country);
      return this.database.get(country).map((doc) => {
      	console.log(doc);
      	doc.users = doc.users.filter(id => id !== user.id);
      	return this.database.update(doc);
      })
    });*/
  }

  userMapFunction(doc) {
    doc.users.forEach(function (user) {
      PouchDB.emit(user.username);
    });
  }

  countryMapFunction(doc) {
    PouchDB.emit(doc.countryInfo.name);
  }

  public sync(remote: string) : Promise<any> {
        let remoteDatabase = new PouchDB(remote);
        return this.db.sync(remoteDatabase, {
            live: true,
            retry: true
        }).on('error', error => {
            console.error(JSON.stringify(error));
        });
    }
}