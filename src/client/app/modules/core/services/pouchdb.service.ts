import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { _do } from 'rxjs/operator/do';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { from } from 'rxjs/observable/from';

import { Book } from '../../books/models/book';
import * as PouchDB from "pouchdb";

const IDB_SUCCESS = 'success';
const IDB_COMPLETE = 'complete';
const IDB_ERROR = 'error';
const IDB_UPGRADE_NEEDED = 'upgradeneeded';

const IDB_TXN_READ = 'readonly';
const IDB_TXN_READWRITE = 'readwrite';

export const DB_INSERT = 'DB_INSERT';

export interface DBStore {
  primaryKey?: string;
  autoIncrement?: boolean;
}

export interface DBSchema {
  version: number;
  name: string;
  stores: {[storename: string]: DBStore};
}

@Injectable()
export class PouchDBService {

    public changes: Subject<any> = new Subject();
    private isInstantiated: boolean;
    private database: any;
    private listener: EventEmitter<any> = new EventEmitter();

    public constructor() {
       this.open("books_app");
    }

    public open(dbName: string): Observable<any> {       
        return Observable.create((observer: Observer<any>) => {
             if(!this.isInstantiated) {
                this.database = new PouchDB("books_app");
                this.database.sync("http://localhost:5984/books_app").on('complete', function () {
                  console.log("yay");
                }).on('error', function (err) {
                  console.log("error!");
                });
                this.isInstantiated = true;
            }
            console.log(this.isInstantiated);
        });
    }

    public fetch() {
        return this.database.allDocs({include_docs: true});
    }

    public getAll() : Observable<any> {
        return Observable.create(
            this.fetch()
                .then(docs => {

                    // Each row has a .doc object and we just want to send an 
                    // array of birthday objects back to the calling code,
                    // so let's map the array to contain just the .doc objects.

                    return docs.rows.map(row => {
                        // Convert string to date, doesn't happen automatically.
                        row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });
                }));
    }

    public insert(storeName: string,records: any[], notify: boolean = true): Observable<any> {
        const open$ =  this.open(storeName);
        const write$ = this.database.post(records);
        return _do.call(write$, (payload: any) => notify ? this.changes.next({type: DB_INSERT, payload }) : ({}));
    }

    public get1(storeName: string, key: any): Observable<any> {
        const open$ =  this.open(storeName);

        return mergeMap.call(open$, (db: IDBDatabase) => {

    });
    }

    public get(id: string) : Observable<any> {
        return this.database.get(id);
    }

    
    public add(book: Book) : Observable<any> {
        return this.database.post(book);
    }

    public update(book: Book) : Observable<any> {
        return this.database.put(book);
    }

    public delete(book: Book) : Observable<any> {
        return this.database.remove(book);
    }

    public sync(remote: string) {
        console.log(remote);
        let remoteDatabase = new PouchDB(remote);
        this.database.sync(remoteDatabase, {
            live: true,
            retry: true
        }).on('change', change => {
            this.listener.emit(change);
            console.log(change);
        }).on('paused', function (info) {
          // replication was paused, usually because of a lost connection
          console.log(info);
        }).on('active', function (info) {
          // replication was resumed
          console.log(info);
        }).on('error', error => {
            console.error(JSON.stringify(error));
        });
    }

    public getChangeListener() {
        return this.listener;
    }

    getChanges(): Observable<any> {
        return Observable.create(observer => {

                // Listen for changes on the database.
                this.database.changes({ live: true, since: 'now', include_docs: true })
                    .on('change', change => {
                        // Convert string to date, doesn't happen automatically.
                        change.doc.Date = new Date(change.doc.Date);
                        observer.next(change.doc);
                    });
        });
    }

}