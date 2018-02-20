import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import { IAnalyseState } from '../states/index';
import { Result } from '../models/index';
import { Country } from '../../countries/models/country';

@Injectable()
export class AnalyseService {


  constructor() {
  }

  analyse(analyseState: IAnalyseState): Result {
    let result: Result;
    // THINGS TO DO HERE
    return result;
  }


}