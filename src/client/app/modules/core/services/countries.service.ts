import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';


import * as PouchDB from "pouchdb";
import { User, Country, Flagimg } from '../../countries/models/country';

@Injectable()
export class CountriesService {
  public currentCountry: Observable<Country>;
  public currentUser: Observable<User>;

  private db: any;

  constructor(private http: Http) { 
    /*this.db = new PouchDB('countries');
    this.sync('http://entropie-dev:5984/countries'); */
  }  

  initDB(dbname: string, remote : string) : Promise<any> {
        this.db = new PouchDB(dbname);
        return this.sync(remote+dbname);
  }

  public getAll() : Observable<any> {  
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
    }).then(doc => {
      console.log(doc);
      return doc;
    });
  }

  addCountry(countryJson: any) : Observable<Country> { 
    console.log(countryJson);
    let country = countryJson.pays;
    let url ='../node_modules/svg-country-flags/svg/'+country.code.toLowerCase()+'.svg';
    let headers = new Headers({ 'Content-Type': 'image/svg+xml' });
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });

    return this.http
        .get(url, {
            headers: headers,
            responseType: ResponseContentType.Blob
        })
        .map(res => 
          res.blob())
        .map(blob => {
          let fullCountry = {_id:country.code,code:country.code, name: country.name, flag:{_id:country.code+'_flag',_attachments:{flag:{type:blob.type,data:blob}}}, users: null}
          this.currentCountry = of(fullCountry);
          return this.db.put(fullCountry);
        })
    
  }

  removeCountry(country: Country) : Promise<any>{
    this.currentCountry = null;
    console.log(country);
    return this.db.remove(country);
  }

  addUser(user: User): Observable<any> {
    return this.currentCountry.mergeMap(country => {
      return this.db.get(country.code).map((doc) => {
        console.log(doc);
        user.country=doc.countryInfo.name;
        doc.users[doc.users.length] = user;
        return this.db.update(doc);
      });
    })
  }

  removeUser(user: User): Observable<any> {
    return this.currentCountry.mergeMap(country => {
  	  return this.db.get(country.code).map((doc) => {
        console.log(doc);
        doc.users = doc.users.filter(_id => _id !== user._id);
        return this.db.update(doc);
      });
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