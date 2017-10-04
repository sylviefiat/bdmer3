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
    }).then(result => result.rows && result.rows[0].doc)
    .catch(function (err) {
      console.log(err);
    });
  }

  getCountry(countrycode: string): Observable<Country> {
    return fromPromise(this.db.query(function (doc, emit) {
      emit(doc.code);
    }, {key: countrycode,include_docs:true}).then(function (result) {
      //console.log(result.rows && result.rows[0].doc);
      return result.rows && result.rows[0].doc;
    }).catch(function (err) {
      console.log(err);
    }));
  }

  addCountry(countryJson: any) : Observable<any> { 
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
          return this.db.put(fullCountry)
        })
        .filter(response => {console.log(response);return response.json().ok;})
        .do(() => {
          return this.currentCountry;
        })
    
  }

  removeCountry(country: Country) : Promise<any>{
    this.currentCountry = null;
    //console.log(country);
    return this.db.remove(country);
  }

  addUser(user: User): Observable<Country> {
    console.log(user);
    return this.getCountry(user.countryCode)
      .map(country => {
        if(country.users===null){
          country.users=[];
        }
        country.users[country.users.length] = user;
        console.log(country);
        return this.db.put(country);
      })
      .catch((err,caught) => { console.log(err); return caught;})
  }

  removeUser(user: User): Observable<Country> {
    return this.getCountry(user.countryCode)
      .map(country => {
        country.users = country.users.filter(users => {return users.username!==user.username;});
        return this.db.put(country);
      })
      .catch((err,caught) => { console.log(err); return caught;});
  }

  userMapFunction(doc,emit) {
    doc.users.forEach(function (user) {
      emit(user.username);
    });
  }

  countryNameMapFunction(doc,emit) {
    emit(doc.name);
  }

  countryCodeMapFunction(doc,emit) {
    emit(doc.code);
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