// app
import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState, getisLoggedIn, getUserCountry, getAuthUser} from '../../modules/ngrx/index';
import { User, Country } from '../../modules/countries/models/country';
import { AuthService } from '../../modules/core/services/index';


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
  public isLogged$: Observable<any>;
  
  constructor(private authenticationService: AuthService, private store: Store<IAppState>) {	
	  //authenticationService.getLoggedInUser.subscribe(user => this.setCurrentUser(user));
    //authenticationService.getCountry.subscribe(country => this.setCurrentCountry(country));  
    this.isLogged$ = this.store.let(getisLoggedIn);
    this.currentCountry$ = this.store.let(getUserCountry);
    this.currentUser$ = this.store.let(getAuthUser);
  }

  /*setCurrentUser(ouser: Observable<User>){
  	this.currentUser$ = ouser;
  }

  setCurrentCountry(ocountry: Observable<Country>){
    this.currentCountry$ = ocountry;
  }*/

  /*get isLoggedIn(){
    return this.currentUser$!=null;
  }*/

}
