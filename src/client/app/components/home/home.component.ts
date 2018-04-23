// libs
import { Component, ElementRef, ViewChild, OnInit, Input} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

// app
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getisLoggedIn, getAuthState, getPlatformInApp } from '../../modules/ngrx/index';
import { Platform } from '../../modules/datas/models/index';

@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {

  title: string = 'My first AGM project';
  lat: number = 51.678418;
  lng: number = 7.809007;
  loggedIn: boolean;
  platforms$: Observable<Platform[]>;

  public onlineOffline: boolean = navigator.onLine;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
  	this.loggedIn = this.store["source"]["value"]["auth"]["loggedIn"];
  	if(this.loggedIn){
	  	console.log(this.store["source"]["value"]["auth"]["country"]["code"])
	  	
	  	this.platforms$ = this.store.let(getPlatformInApp);

	  	console.log(this.store.let(getPlatformInApp));
  	}
  }
}
