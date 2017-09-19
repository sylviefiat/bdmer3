import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';

import * as PouchDB from "pouchdb";
import { User, Authenticate } from '../../auth/models/user';


@Injectable()
export class PouchDBService {

    private db: any;

    public constructor() { }

    initDB() : Promise<any> {
        var pouchOpts = {
          skip_setup: true
        };
        this.db = new PouchDB("_users", pouchOpts);
        return this.db;
    }

    public get(auth: Authenticate) : Promise<any> {
         return this.db.get(auth);
    }

    public add(user: User) : Promise<any> {
         return this.db.post(user);
    }

    public update(user: User) : Promise<any> {
        return this.db.put(user);
    }

    public delete(user: User) : Promise<any> {
        return this.db.remove(user);

    } 

}