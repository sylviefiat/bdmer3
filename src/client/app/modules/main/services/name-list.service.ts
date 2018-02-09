// angular
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// libs
import { Observable } from 'rxjs/Observable';

// app
import { Config } from '../../core/index';

// module
import { NameList } from '../actions/index';

@Injectable()
export class NameListService {

  constructor(
    private http: Http
  ) {
  }

  getNames(): Observable<Array<string>> {
    return this.http.get(`${Config.IS_MOBILE_NATIVE() ? '/' : ''}assets/data.json`)
      .map(res => res.json());
  }
}
