// app
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IAppState} from '../../../ngrx/index';
import { User } from '../../../auth/models/user';
import { AuthService } from '../../../auth/services/index';


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
  
  constructor(private store: Store<IAppState>,private authenticationService: AuthService) {	
	authenticationService.getLoggedInUser.subscribe(user => this.setCurrentUser(user));
  }

  setCurrentUser(user: User){
  	console.log(user);
  	this.isLoggedIn = user.name != null ? true:false;
  	this.currentUser = user;
  }

  ngOnInit() { 
  }

}
