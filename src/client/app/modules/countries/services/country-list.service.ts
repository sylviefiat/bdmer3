// angular
import { Injectable } from '@angular/core';
import { Http, ResponseContentType, Headers, RequestOptions } from '@angular/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// libs
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscriber } from 'rxjs/Subscriber';

// app
import { Config } from '../../core/index';


@Injectable()
export class CountryListService {

  constructor(
    private http: Http, private sanitizer: DomSanitizer) {
  }

  getCountryList(): Observable<any> {
    return this.http.get(`${Config.IS_MOBILE_NATIVE() ? '/' : ''}../node_modules/svg-country-flags/countries.json`)
      .map(res => res.json())
      .map(row => {
        let keys = [];
        for (let key in row) {
          keys.push({code: key, name: row[key], flag: this.getCountrySVG(key)});
        }
        return keys;
      });
  }

  getCountryName(code: string): any {
    return this.getCountryList()
      .filter(country => country[0] === code)
      .map(country => country[1]);
  }

  getCountrySVG(code: string): Observable<any> {
    let url ='../node_modules/svg-country-flags/svg/'+code.toLowerCase()+'.svg';
    let headers = new Headers({ 'Content-Type': 'image/svg+xml' });
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    //console.log("http");
    return this.http
        .get(url, {
            headers: headers,
            responseType: ResponseContentType.Blob
        })
        .map(res => 
          res.blob())
        .map(blob => {
            let urlCreator = window.URL;
            let safeUrl = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
            //console.log(safeUrl);
            return safeUrl;
            })
        .catch((error:any) => Observable.throw(error));
    /*return new Observable((observer: Subscriber<any>) => {
      let objectUrl: string = null;
      
      this.http
        .get(url,  options)

        .subscribe(
          (dataReceived:any) => {
            let blob = new Blob([dataReceived._body], {
                type: dataReceived.headers.get("Content-Type")
            });
            var urlCreator = window.URL;
            objectUrl = urlCreator.createObjectURL(blob);
            //console.log(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
            observer.next(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
        });

        return () => {
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                    objectUrl = null;
                }
            };
    });*/
  }
}
