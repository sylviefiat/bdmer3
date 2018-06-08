import { Component, OnInit, ViewChild, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { LngLatBounds } from 'mapbox-gl';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country, Coordinates } from '../../modules/countries/models/country';
import { IAppState } from '../../modules/ngrx/index';


@Component({
  selector: 'bc-home-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mgl-map
    [style]="'mapbox://styles/mapbox/streets-v9'"
    [fitBounds]="bounds"
    [fitBoundsOptions]="{
      padding: boundsPadding
    }">
      <mgl-marker *ngFor="let marker of markers"
        [lngLat]="marker"
      >
        <div
          class="marker"
          style="background-image: url(https://placekitten.com/g/50/50/); width: 50px; height: 50px"
        >
        </div>
      </mgl-marker>
      
    </mgl-map>
  `,
  styles: [
    `    
    mgl-map {
      height:         calc(100vh - 96px);
      width: 100%;
    }
    @media screen and (max-width: 800px) {
      height:50vh;
    }
    `]
})
export class MapComponent implements OnInit, OnChanges {
  @Input() platforms: Platform[];
  @Input() countries: Country[];

  lat: number =0;
  lng: number =0;
  bounds: LngLatBounds;
  boundsPadding: number = 5;

  zoomMarkerConst: number = 8;
  zoomLayerConst: number = 11;
  zoomAdmin: number = 3;
  zoom: number = 9;

  geoJsonObject: Object;
  markers: any[] = [];


  constructor() {
  }

  ngOnInit() {
    console.log(this.countries);
    this.init();
  }

  ngOnChanges(){
    this.init();
  }

  ngAfterViewInit() {
  }

  zoomChange(event) {
    this.zoom = event;
  }

  init(){
    if(this.countries.length>0){
      this.markers = this.countries.filter(country => country.code!=='AA').map(country => [country.coordinates.lng,country.coordinates.lat]);
      this.zoomToBounds(this.markers);
      console.log(this.markers);
      //if(this.platforms.length>0){
        //this.initMarkers(this.markers);
      //}
    }
  }

  zoomToBounds(coordinates) {    
    this.bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(<any>coord);
    }, new LngLatBounds(coordinates[0], coordinates[0]));
  }

  initMarkers(coordinates) {
    console.log(coordinates);
    for (let coord of coordinates) {
      console.log(coord);
      //this.markers.push([coord.lng,coord.lat]);
    }

    console.log(this.markers);
    console.log(this.zoom);
  }

  zoomMarker(marker) {
    this.lat = marker.lat;
    this.lng = marker.lng;
    this.zoom = this.zoomMarkerConst;
  }

  zoomLayer(event) {
    this.lat = event.latLng.lat();
    this.lng = event.latLng.lng();
    this.zoom = this.zoomLayerConst;
  }

}