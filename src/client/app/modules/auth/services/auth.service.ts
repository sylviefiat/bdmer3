import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { User, Authenticate } from '../models/user';

@Injectable()
export class AuthService {
  public token: string;
  constructor(private http: Http) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    //this.headers = new Headers();
    //this.headers.set('Content-Type', 'application/json');
  }

  login({ username, password }: Authenticate) {    
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    /*return this.http
      //.get('http://entropie-dev.ird.nc:5984/_session?basic=true')
      .post('http://entropie-dev.ird.nc:5984/_session', JSON.stringify({ name: username, password: password }), options)
        .subscribe(data => {console.log(data)}, error => {
          console.log(error.json());
      });*/
    return this.http.post('http://entropie-dev.ird.nc:5984/_session', JSON.stringify({ name: username, password: password }), options)
            .map((response: Response) => {
              console.log(response);
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().ok;
                if (token) {
                    // set token property
                    this.token = token;
 
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
 
                    // return true to indicate successful login
                    return of({ name: 'User' });
                } else {
                  console.log("FAILED LOGIN");
                    // return false to indicate failed login
                    return null;
                }
            });

  }

  logout() {
    this.token = null;
    localStorage.removeItem('currentUser');
    return of(true);
  }
}