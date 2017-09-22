// app
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
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
export class NavbarComponent implements OnInit {
  public isLoggedIn: boolean;
  public currentUser: User;
  public currentCountry: Country;
  
  constructor(private store: Store<IAppState>,private authenticationService: AuthService) {	
	  authenticationService.getLoggedInUser.subscribe(user => this.setCurrentUser(user));
    authenticationService.getCountry.subscribe(country => this.setCurrentCountry(country));
  }

  setCurrentUser(user: User){
  	console.log(user);
  	this.isLoggedIn = user.username != null ? true:false;
  	this.currentUser = user;
  }

  setCurrentCountry(country: Country){
    console.log(country);
    this.currentCountry = country;
  }

  ngOnInit() { 
  }

}
