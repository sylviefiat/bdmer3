// libs
import { Component, ElementRef, ViewChild, OnInit, Input, AfterViewInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral } from '@agm/core';

// app
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getisLoggedIn, getAuthState, getAuthCountry, getPlatformInApp, getSelectedUser, getSelectedCountryPlatforms, getAllCountriesInApp} from '../../modules/ngrx/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country'
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { CountryListService} from '../../modules/countries/services/country-list.service';

declare var google: any;

@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit {

  lat: number;
  lng: number;

  zoomMarkerConst: number = 8;
  zoomLayerConst: number = 11;
  zoomAdmin: number = 3;

  geoJsonObject: Object;
  loggedIn: boolean;
  platforms$: Observable<Platform[]>;
  userCountry$: Observable<Country>
  platforms: any;
  zoom: number = 9;
  countries$: Observable<Country[]>;
  markers: any[] = [];
  codeCountryUser: string;

  @ViewChild('AgmMap') agmMap: AgmMap;

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
            this.codeCountryUser = res.code;
            if(res.code !== "AA"){
              this.platforms$ = this.platforms$
                .map(platforms => platforms.filter(platform => platform.codeCountry === res.code));
              this.lat = res.coordinates.lat;
              this.lng = res.coordinates.lng;
              this.initMarkers();
            }else{
              this.initMarkers();
              this.zoom = this.zoomAdmin;
            }
          }
        } 
      );
    }
  }

  ngAfterViewInit() {
    if(this.loggedIn && this.codeCountryUser === "AA"){
      this.agmMap.mapReady.subscribe(map => {
        let bounds: LatLngBounds = new google.maps.LatLngBounds();
        if(this.markers.length > 1){
          for(let i = 0; i < this.markers.length; i++){
            bounds.extend(new google.maps.LatLng(this.markers[i].lat, this.markers[i].lng));
          }
          map.fitBounds(bounds);
        }
      });
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

          if(this.markers.length == 1 && this.codeCountryUser === "AA"){
            this.lat = this.markers["0"].lat;
            this.lng = this.markers["0"].lng;
            this.zoom = 9;
          }

          if(platforms.length == 0){
            this.zoom = 3;
          }
        })
      });
  }

  zoomMarker(marker){
    this.lat = marker.lat;
    this.lng = marker.lng; 
    this.zoom = this.zoomMarkerConst;
  }

  zoomLayer(event){
    this.lat = event.latLng.lat();
    this.lng = event.latLng.lng();
    this.zoom = this.zoomLayerConst;
  }
}
