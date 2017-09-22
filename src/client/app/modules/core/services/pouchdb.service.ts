import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';

import * as PouchDB from "pouchdb";
import * as PouchDBAuth from "pouchdb-authentication";

//import { Book } from '../../books/models/book';


@Injectable()
export class PouchDBService {

    private db: any;

    public constructor() { 
        PouchDB.plugin(PouchDBAuth);
    }

    initDB(dbname: string, remote : string, useLocal: boolean = true) : Promise<any> {
        var pouchOpts = {
          skip_setup: true
        };
        console.log(useLocal);
        if(useLocal){
            this.db = new PouchDB(dbname, pouchOpts);
            return this.sync(remote+dbname);
        } else {

            return this.db= new PouchDB(remote+dbname, pouchOpts);
        }
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

    public add(any: any) : Promise<any> {
         return this.db.post(any);
    }

    public get(any: any) : Observable<any> {
         return this.db.get(any);
    }

    public update(any: any) : Promise<any> {
        return this.db.put(any);
    }

    public delete(any: any) : Promise<any> {
        return this.db.remove(any);
    } 

    public query(func: any, any: any) : Observable<any> {
        return fromPromise(
            this.db.query(func, any)
                .then(docs => {
                    return docs.rows.map(row => {
                        return row.doc;
                    });
                }));
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


    getChanges(): Observable<any> {
        return Observable.create(observer => {
                this.db.changes({ live: true, since: 'now', include_docs: true })
                    .on('change', change => {
                        observer.next(change.doc);
                    });
        });
    }


}

