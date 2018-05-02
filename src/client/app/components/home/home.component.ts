// libs
import { Component, ElementRef, ViewChild, OnInit, Input} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GoogleMapsAPIWrapper } from '@agm/core';

// app
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getisLoggedIn, getAuthState, getAuthCountry, getPlatformInApp, getSelectedUser, getSelectedCountryPlatforms, getAllCountriesInApp} from '../../modules/ngrx/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country'
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { CountryListService} from '../../modules/countries/services/country-list.service';

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
  countries$: Observable<Country[]>;
  markers: any[] = [];

  public onlineOffline: boolean = navigator.onLine;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, 
  	googleMapsAPIWrapper: GoogleMapsAPIWrapper, private countryListService: CountryListService) {}

  ngOnInit() {
  	this.loggedIn = this.store["source"]["value"]["auth"]["loggedIn"];
  	if(this.loggedIn){
      this.platforms$ = this.store.let(getPlatformInApp);
  		this.store.dispatch(new PlatformAction.LoadAction());

      this.userCountry$ = this.store.let(getAuthCountry);

      this.countries$ = this.store.let(getAllCountriesInApp);
      this.store.dispatch(new CountriesAction.LoadAction()); 

      this.userCountry$.subscribe(
        (res) => {
          if(res){
            if(res.code !== "AA"){
              this.platforms$ = this.platforms$
                .map(platforms => platforms.filter(platform => platform.codeCountry === res.code));
              this.lat = res.coordinates.lat;
              this.lng = res.coordinates.lng;
              this.initMarkers();
            }else{
              this.initMarkers();
              this.zoom = 3
            }
          }
        } 
      );
  	}
  }

  zoomChange(event){
    this.zoom = event;
  }

  initMarkers(){
    this.platforms$.subscribe(
      (platforms) => {
        this.countries$.subscribe((countries) =>{
          for(let i = 0; i < countries.length; i++){
            for(let y = 0; y < platforms.length; y++){
              if(countries[i].code === platforms[y].codeCountry){
                this.markers.push(countries[i].coordinates)
              }
            }
          }
        })
      });
  }

  zoomMarker(marker){
    this.lat = marker.lat;
    this.lng = marker.lng; 
    this.zoom = 6;
  }

  zoomLayer(event){
    this.lat = event.latLng.lat();
    this.lng = event.latLng.lng();
    this.zoom = 9;
  }
}
