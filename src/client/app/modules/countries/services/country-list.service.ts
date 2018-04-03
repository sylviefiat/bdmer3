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
import { Country } from '../../countries/models/country';


@Injectable()
export class CountryListService {

  constructor(
    private http: Http, private sanitizer: DomSanitizer) {
  }

  getCountryList(): Observable<Country[]> {
    return this.http.get(`${Config.IS_MOBILE_NATIVE() ? '/' : ''}assets/countries.json`)
      .map(res => res.json())
      .map(row => {
        let keys = [];
        for (let key in row) {
          let pays={code: key, name: row[key], flag: this.getCountrySVG(key)};
          keys.push(pays);
        }
        return keys;
      });
    
  }

  getCountryName(code: string): any {
    return this.getCountryList()
      .map(countries => countries
        .filter(country => country.code === code))
        .map(countries => countries[0].name);
  }

  getCountrySVG(code: string): SafeUrl {
    let url ='assets/svg/'+code.toLowerCase()+'.svg';
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
          let urlCreator = window.URL;
          let objectUrl = urlCreator.createObjectURL(blob);
          let safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          return safeUrl;
        })
        .catch((error:any) => Observable.throw(error));
    
    //return new Observable((observer: Subscriber<any>) => {
    /*  let objectUrl: string = null;
      
      return this.http
        .get(url,  options)
        .subscribe(
          (dataReceived:any) => {
            let blob = new Blob([dataReceived._body], {
                type: dataReceived.headers.get("Content-Type")
            });
            return {_attachments : {flag :{ type: blob.type, data: blob}}};
            /*var urlCreator = window.URL;
            objectUrl = urlCreator.createObjectURL(blob);
            //console.log(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
            this.sanitizer.bypassSecurityTrustUrl(objectUrl);*/
       /* });*/

        /*return () => {
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                    objectUrl = null;
                }
            };
    });*/
  }

  getCountrySVGBlob(code: string): Observable<Blob> {
    let url ='../node_modules/svg-country-flags/svg/'+code.toLowerCase()+'.svg';
    let headers = new Headers({ 'Content-Type': 'image/svg+xml' });
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });

    return this.http
        .get(url, {
            headers: headers,
            responseType: ResponseContentType.Blob
        })
        .map(res => {
          return res.blob()
        })
        .catch((error:any) => Observable.throw(error));
      }
}
