// app
import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAppState} from '../../../ngrx/index';
import { User, Country } from '../../../countries/models/country';
import { AuthService } from '../../../core/services/index';


@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: [
    'navbar.component.css',
  ],
})
export class NavbarComponent  {
  public currentUser$: Observable<User>;
  public currentCountry$: Observable<Country>;
  
  constructor(private authenticationService: AuthService) {	
	  authenticationService.getLoggedInUser.subscribe(user => this.setCurrentUser(user));
    authenticationService.getCountry.subscribe(country => this.setCurrentCountry(country));    
  }

  setCurrentUser(ouser: Observable<User>){
  	this.currentUser$ = ouser;
  }

  setCurrentCountry(ocountry: Observable<Country>){
    this.currentCountry$ = ocountry;
  }

  get isLoggedIn(){
    return this.currentUser$!=null;
  }

}
