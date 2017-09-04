import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { User, Authenticate } from '../models/user';

@Injectable()
export class AuthService {
  public token: string;
  constructor(private http: Http) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login({ username, password }: Authenticate) {
    return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    // set token property
                    this.token = token;
 
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
 
                    // return true to indicate successful login
                    return of({ name: 'User' });
                } else {
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