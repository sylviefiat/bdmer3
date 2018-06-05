import { Component, OnInit, ViewChild, Input, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral } from '@agm/core';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';
import { IAppState } from '../../modules/ngrx/index';

declare var google: any;

@Component({
  selector: 'bc-home-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <agm-map #AgmMap [latitude]="lat" [longitude]="lng" [zoom]="zoom" (zoomChange)="zoomChange($event)">
        <div *ngFor="let platform of (platforms$ | async)">
          <div *ngFor="let zone of (platform.zones)">
            <agm-data-layer [geoJson]="zone" (layerClick)="zoomLayer($event)">
            </agm-data-layer>
            <div *ngIf="zoom > 10" >
              <agm-marker *ngFor="let station of (zone.stations)"
                [latitude]="station.geometry.coordinates[1]"
                   [longitude]="station.geometry.coordinates[0]"
                   label="T">
              </agm-marker>
            </div>
          </div>
        </div>

        <div *ngIf="zoom < 6" >
          <agm-marker *ngFor="let marker of (markers)"
            fit="true"
            [latitude]="marker.lat"
               [longitude]="marker.lng"
               (markerClick)="zoomMarker(marker)">
          </agm-marker>
        </div>
      </agm-map>
  `,
  styles: [
    `    
    agm-map {
      height:         calc(100vh - 96px);
      width: 100%;
    }
    @media screen and (max-width: 800px) {
      height:50vh;
    }
    `]
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() platforms: Platform[];
  @Input() countries: Country[];

  lat: number;
  lng: number;

  zoomMarkerConst: number = 8;
  zoomLayerConst: number = 11;
  zoomAdmin: number = 3;
  zoom: number = 9;

  geoJsonObject: Object;
  markers: any[] = [];

  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(googleMapsAPIWrapper: GoogleMapsAPIWrapper) {
  }

  ngOnInit() {
    console.log(this.platforms);
    this.initMarkers();
  }

  ngAfterViewInit() {
    this.agmMap.mapReady.subscribe(map => {
      let bounds: LatLngBounds = new google.maps.LatLngBounds();
      if (this.markers.length > 1) {
        for (let i = 0; i < this.markers.length; i++) {
          bounds.extend(new google.maps.LatLng(this.markers[i].lat, this.markers[i].lng));
        }
        map.fitBounds(bounds);
      }
    });
  }

  zoomChange(event) {
    this.zoom = event;
  }

  initMarkers() {
    for (let country of this.countries) {
      for (let platform of this.platforms) {
        if (country.code === platform.codeCountry) {
          this.markers.push(country.coordinates)
        }
      }
    }

    if (this.markers.length == 1) {
      this.lat = this.markers["0"].lat;
      this.lng = this.markers["0"].lng;
      this.zoom = 9;
    }

    if (this.platforms.length == 0) {
      this.zoom = 3;
    }
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