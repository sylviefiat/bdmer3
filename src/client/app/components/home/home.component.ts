// libs
import { Component, ElementRef, ViewChild, OnInit, Input} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GoogleMapsAPIWrapper } from '@agm/core';

// app
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getisLoggedIn, getAuthState, getAuthCountry, getPlatformListCurrentCountry } from '../../modules/ngrx/index';
import { Platform } from '../../modules/datas/models/index';
import { PlatformAction } from '../../modules/datas/actions/index';

@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {

  title: string = 'My first AGM project';
  lat: number = -4.6838871;
  lng: number = 55.4494781;

  point: Object = {
  	lng: 55.48547651530164,
    lat: -4.595906847190321
  }

  point2: Object = {
  	lng: 55.19794810211319,
    lat: -4.45897887407234
  }

  
              

  geoJsonObject: Object;
  loggedIn: boolean;
  platforms$: Observable<Platform[]>;

  public onlineOffline: boolean = navigator.onLine;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, 
  	googleMapsAPIWrapper: GoogleMapsAPIWrapper) {}

  ngOnInit() {
  	this.loggedIn = this.store["source"]["value"]["auth"]["loggedIn"];
  	if(this.loggedIn){
  		this.platforms$ = this.store.let(getPlatformListCurrentCountry);
  		this.store.dispatch(new PlatformAction.LoadAction());
  	}
  }
}
