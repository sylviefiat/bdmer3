// app
import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState, getisLoggedIn, getAuthCountry, getAuthUser} from '../../modules/ngrx/index';
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
  
  open: boolean = false;

  constructor(private authenticationService: AuthService, private store: Store<IAppState>) {	 
    this.isLogged$ = this.store.let(getisLoggedIn);
    this.currentCountry$ = this.store.let(getAuthCountry);
    this.currentUser$ = this.store.let(getAuthUser);
  }
}
