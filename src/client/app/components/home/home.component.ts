// libs
import { Component, ElementRef, ViewChild, OnInit, Input} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GoogleMapsAPIWrapper } from '@agm/core';

// app
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getisLoggedIn, getAuthState, getAuthCountry, getPlatformInApp, getSelectedUser, getPlatformListCurrentCountry } from '../../modules/ngrx/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country'
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {

  lat: number;
  lng: number;

  geoJsonObject: Object;
  loggedIn: boolean;
  platforms$: Observable<Platform[]>;
  userCountry$: Observable<Country>
  platforms: any;
  zoom: number = 9;

  public onlineOffline: boolean = navigator.onLine;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, 
  	googleMapsAPIWrapper: GoogleMapsAPIWrapper) {}

  ngOnInit() {
  	this.loggedIn = this.store["source"]["value"]["auth"]["loggedIn"];
  	if(this.loggedIn){
      this.platforms$ = this.store.let(getPlatformInApp);
  		this.store.dispatch(new PlatformAction.LoadAction());

      this.userCountry$ = this.store.let(getAuthCountry);

      this.userCountry$.subscribe(
        (res) => {
          if(res.code !== "AA"){
            this.platforms$ = this.platforms$
              .map(platforms => platforms.filter(platform => platform.codeCountry === res.code));
            this.lat = res.coordinates.lat;
            this.lng = res.coordinates.lng;
          }else{
            this.zoom = 3
          }
        } 
      );
  	}
  }
}
