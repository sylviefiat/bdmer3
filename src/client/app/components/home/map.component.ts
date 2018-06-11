import { Component, OnInit, ViewChild, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, pipe, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { LngLatBounds, Layer } from 'mapbox-gl';
import * as Turf from '@turf/turf';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform, Zone, Station } from '../../modules/datas/models/index';
import { Country, Coordinates } from '../../modules/countries/models/country';
import { IAppState } from '../../modules/ngrx/index';


@Component({
  selector: 'bc-home-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mgl-map
    [style]="'mapbox://styles/mapbox/satellite-v9'"
    [fitBounds]="bounds$ | async"
    [fitBoundsOptions]="{
      padding: boundsPadding,
      maxZoom: zoomMax
    }" 
    (zoomChange)="zoomChange($event)">
      <ng-container *ngIf="isDisplayed('countries')">
        <mgl-marker *ngFor="let marker of markersCountries"
          [lngLat]="marker.lngLat">
          <div (click)="zoomOnCountry(marker.country)"
            class="marker"><fa [name]="'map-marker'" [border]=false [size]=3></fa>
          </div>
        </mgl-marker>
      </ng-container>
      <ng-container *ngIf="(layerZones$ | async) && isDisplayed('zones')">
        <mgl-geojson-source 
          id="layerZones"
          [data]="layerZones$ | async">
          <mgl-layer (click)="zoomOnStation($event)"
            id="zonesid"
            type="fill"
            source="layerZones"
            [paint]="{
              'fill-color': '#AFEEEE',
              'fill-opacity': 0.3,
              'fill-outline-color': '#000'
              }"
          ></mgl-layer>        
        </mgl-geojson-source>
      </ng-container>
      <ng-container *ngIf="(layerStations$ | async) && isDisplayed('stations')">
        <mgl-geojson-source 
          id="layerStations"
          [data]="layerStations$ | async">
          <mgl-layer
            id="stationsid"
            type="circle"
            source="layerStations"
            [paint]="{
              'circle-color': 'rgba(0,255,0,1)',
              'circle-radius': 20
              }"
          ></mgl-layer>        
        </mgl-geojson-source>
      </ng-container>
      
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

  bounds$: Observable<LngLatBounds>;
  boundsPadding: number = 100;

  zoomMax: number = 11;
  zoom: number = 9;

  markersCountries: any[] = [];
  zones: Zone[] = [];
  layerZones$: Observable<object>;
  stations: Station[] = [];
  layerStations$: Observable<object>;

  show: string;

  constructor() {
  }

  ngOnInit() {
    //console.log(this.countries);
    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  ngAfterViewInit() {
  }

  zoomChange(event) {
    console.log(event);
    this.zoom = event;
    if(this.zoom<9) this.show='zones';
    if(this.zoom<6) this.show='countries';
  }

  init() {
    if (this.countries.length > 0) {
      this.markersCountries = this.countries.filter(country => country.code !== 'AA').map(country => ({
        'country': country.code,
        'lngLat': [country.coordinates.lng, country.coordinates.lat]
      }));      
      if (this.platforms.length > 0) {
        this.setZones(this.platforms);
        this.setStations(this.platforms);
      }
      if(this.countries.length===1 && this.platforms.length > 0){
         this.bounds$=this.layerZones$.map(layerZones => this.zoomToZonesOrStation(layerZones));
         this.show='zones';
      } else {
        this.bounds$=of(this.zoomToCountries(this.markersCountries.map(mk => mk.lngLat)));
        this.show='countries';
      }
      
    }
  }

  isDisplayed(layer: string){
    return this.show===layer;
  }

  zoomToCountries(coordinates): LngLatBounds {   
    return coordinates.reduce((bnd, coord) => {
      return bnd.extend(<any>coord);
    }, new LngLatBounds(coordinates[0], coordinates[0]));
  }

  zoomToZonesOrStation(featureCollection): LngLatBounds{
    var bnd = new LngLatBounds();
    var fc= featureCollection.features.forEach((feature) => bnd.extend(feature.geometry.coordinates[0]));
    return bnd;
  }

  zoomOnCountry(countryCode: string) {
    let platformsConsidered = this.platforms.filter(platform => platform.codeCountry===countryCode)
    this.setZones(platformsConsidered);
    console.log(platformsConsidered);
    if(platformsConsidered.length>1){
      this.bounds$=this.layerZones$.map(layerZones => this.zoomToZonesOrStation(layerZones));
    } else {
      this.bounds$=of(this.zoomToCountries(this.markersCountries.filter(mk => mk.country===countryCode).map(mk => mk.lngLat)));
    }
    this.show='zones';
  }

  zoomOnStation(event: any) {
    console.log(event);
    /*let platformsConsidered = this.platforms.filter(platform => platform.zones.filter(zone => zone.properties.code ===zoneCode).length>0)
    this.setStations(platformsConsidered);
    this.bounds$=this.layerStations$.map(layerStations => this.zoomToZonesOrStation(layerStations)); */  
    this.bounds$= of(new LngLatBounds([event.lngLat.lng, event.lngLat.lat],[event.lngLat.lng, event.lngLat.lat]));
    this.show='stations';
  }


  setZones(platforms: Platform[]) {
    this.zones = [];
    for (let p of platforms) {
      this.zones = [...this.zones, ...p.zones];
    }
    this.layerZones$ = of(Turf.featureCollection(this.zones.map(zone => Turf.polygon(zone.geometry.coordinates))));
  }

  setStations(platforms: Platform[]) {
    this.stations = [];
    for (let p of platforms) {
      this.stations = [...this.stations, ...p.stations];
    }
    this.layerStations$ = of(Turf.featureCollection(this.stations.map(station => Turf.point(station.geometry.coordinates))));
  }


}