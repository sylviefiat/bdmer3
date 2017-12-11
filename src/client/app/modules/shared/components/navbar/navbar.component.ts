// app
import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState} from '../../../ngrx/index';
import { User, Country } from '../../../countries/models/country';
import { AuthService } from '../../../core/services/index';
import { AuthAction } from '../../../auth/actions/index';


@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: [
    'navbar.component.css',
  ],
})
export class NavbarComponent implements OnInit  {
  public currentUser$: Observable<User>;
  public currentCountry$: Observable<Country>;
  
  constructor(private authenticationService: AuthService, private store: Store<IAppState>) {	
	  authenticationService.getLoggedInUser.subscribe(user => this.setCurrentUser(user));
    authenticationService.getCountry.subscribe(country => this.setCurrentCountry(country));    
  }

  ngOnInit() {
    console.log("here");
    this.store.dispatch(new AuthAction.Session(true));
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
