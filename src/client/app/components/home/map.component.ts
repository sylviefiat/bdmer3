import { Component, OnInit, ViewChild, Input, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';
import { IAppState } from '../../modules/ngrx/index';


@Component({
  selector: 'bc-home-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <map></map>
  `,
  styles: [
    `    
    map {
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


  constructor() {
  }

  ngOnInit() {
    this.initMarkers();
  }

  ngAfterViewInit() {
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