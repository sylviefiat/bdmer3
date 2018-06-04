// angular
import { Injectable } from '@angular/core';
import { Http, ResponseContentType, Headers, RequestOptions } from '@angular/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// libs
import { Observable, of, pipe, throwError } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';

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
      .pipe(
        map(res => res.json()),
        map(row => {
          let keys = [];
          for (let key in row) {
            let pays={code: key, name: row[key], flag: this.getCountrySVG(key)};
            keys.push(pays);
          }
          return keys;
        })
      );    
  }

  getCountryName(code: string): any {
    return this.getCountryList()
      .pipe(
        map(countries => countries.filter(country => country.code === code)),
        map(countries => countries[0].name)
      );
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
        .pipe(
          map(res => res.blob()),
          map(blob => {
            let urlCreator = window.URL;
            let objectUrl = urlCreator.createObjectURL(blob);
            let safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
            return safeUrl;
          }),
          catchError((error:any) => throwError(error))
        );
    
  }

  getCountrySVGBlob(code: string): Observable<Blob> {
    let url ='../node_modules/svg-country-flags/svg/'+code.toLowerCase()+'.svg';
    let headers = new Headers({ 'Content-Type': 'image/svg+xml' });
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });

    return this.http.get(url, {
        headers: headers,
        responseType: ResponseContentType.Blob
      })
      .pipe(
          map(res => res.blob()),
          catchError((error:any) => throwError(error))
      );
      }
}
