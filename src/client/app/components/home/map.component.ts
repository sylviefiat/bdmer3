import { Component, OnInit, ViewChild, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, pipe, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { LngLatBounds, Layer, LngLat, MapMouseEvent } from 'mapbox-gl';
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
      maxZoom: zoomMaxMap
    }" 
    (zoomEnd)="zoomChange($event)">
      <ng-container *ngIf="isDisplayed('countries')">
        <mgl-marker *ngFor="let marker of markersCountries"
          [lngLat]="marker.lngLat">
          <div 
            (click)="zoomOnCountry(marker.country)"
            class="marker"
            (mouseEnter)="cursorStyle = 'pointer'"
            (mouseLeave)="cursorStyle = ''">
            <fa [name]="'map-marker'" [border]=false [size]=3></fa><br/>
            <span>{{marker.name}}</span>
          </div>
        </mgl-marker>
      </ng-container>
      <ng-container *ngIf="(layerZones$ | async) && isDisplayed('zones')">
        <mgl-geojson-source 
          id="layerZones"
          [data]="layerZones$ | async">
          <mgl-layer
            id="zonesid"
            type="fill"
            source="layerZones"
            [paint]="{
              'fill-color': '#AFEEEE',
              'fill-opacity': 0.3,
              'fill-outline-color': '#000'
              }">            
          </mgl-layer>
          <mgl-layer
            id="zonestext"
            type="symbol"
            source="layerZones"
            [layout]="{
              'text-field': '{code}',
              'text-anchor':'bottom',
              'text-font': [
                'DIN Offc Pro Italic',
                'Arial Unicode MS Regular'
              ],
              'symbol-placement': 'point',
              'symbol-avoid-edges': true,
              'text-max-angle': 30,
              'text-size': 12
            }"  
            [paint]="{
              'text-color': 'white'
            }"
          >            
          </mgl-layer>
        </mgl-geojson-source>
      </ng-container>
      <ng-container *ngIf="(layerStations$ | async) && isDisplayed('stations')">
        <mgl-geojson-source 
          id="layerStations"
          [data]="layerStations$ | async">
          <mgl-layer
            id="stationsid"
            type="symbol"
            source="layerStations"
            [layout]="{
              'icon-image': 'triangle-stroked-15',
              'icon-size': 1.5,
              'icon-rotate': 180
              }"            
            (click)="showPopupStation($event)"
            (mouseEnter)="cursorStyle = 'pointer'"
            (mouseLeave)="cursorStyle = ''">
          </mgl-layer>        
        </mgl-geojson-source>
      </ng-container>
      <mgl-popup *ngIf="selectedStation"
        [lngLat]="selectedStation.geometry?.coordinates">
        <span style="color:black;">{{'STATION' | translate}} {{selectedStation.properties?.code}}</span>
      </mgl-popup>
      <mgl-popup *ngIf="selectedZone"
        [lngLat]="selectedZone.geometry?.coordinates[0][0]">
        <span style="color:black;padding-right:10px;">{{'ZONE' | translate}} {{selectedZone.properties?.code}}</span>
      </mgl-popup>
      
    </mgl-map>
  `,
  styles: [
    `    
    mgl-map {
      height:         calc(100vh - 96px);
      width: 100%;
    }
    .mapboxgl-popup-content {
      color:black;
    }
    @media screen and (max-width: 800px) {
      height:50vh;
    }
    `]
})
export class MapComponent implements OnInit, OnChanges {
  @Input() platforms: Platform[];
  @Input() countries: Country[];
  @Input() isAdmin: boolean;

  bounds$: Observable<LngLatBounds>;
  boundsPadding: number = 100;

  zoomMaxMap: number = 10;
  zoom = 9;
  zoomMinCountries: number = 4;
  zoomMinStations: number = 3;
  zoomMaxStations: number = 5;
  selectedStation: GeoJSON.Feature<GeoJSON.Point> | null;
  selectedZone: GeoJSON.Feature<GeoJSON.Polygon> | null;

  markersCountries: any[] = [];
  zones: Zone[] = [];
  layerZones$: Observable<object>;
  stations: Station[] = [];
  layerStations$: Observable<object>;

  show: string = 'countries';

  constructor() {
  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  ngAfterViewInit() {
  }

  zoomChange(event) {
    this.zoom = event.target.getZoom();
    
    if(this.zoom<=this.zoomMinCountries) this.show='countries'; 
    if(this.zoom<=this.zoomMaxStations && this.zoom>this.zoomMinCountries) this.show='countries,zones';   
    if(this.zoom>this.zoomMaxStations) this.show='zones,stations';
  }

  init() {
    if (this.countries.length > 0) {
      this.markersCountries = this.countries.filter(country => country.code !== 'AA').map(country => ({
        'country': country.code,
        'name':country.name,
        'lngLat': [country.coordinates.lng, country.coordinates.lat]
      }));      
      if (this.platforms.length > 0) {
        this.setZones(this.platforms);
        this.setStations(this.platforms);
      }
      if(this.countries.length===1 && this.platforms.length > 0){
         this.bounds$=this.layerZones$.map(layerZones => this.zoomToZonesOrStation(layerZones));
      } else {
        this.bounds$=of(this.zoomToCountries(this.markersCountries.map(mk => mk.lngLat)));
      }
      
    }
  }

  isDisplayed(layer: string){
    return this.show.indexOf(layer)>=0;
  }

  zoomToCountries(coordinates): LngLatBounds {   
    return coordinates.reduce((bnd, coord) => {
      return bnd.extend(<any>coord);
    }, new LngLatBounds(coordinates[0], coordinates[0]));
  }

  zoomToZonesOrStation(featureCollection): LngLatBounds{
    var bnd = new LngLatBounds();
    var fc= featureCollection.features.forEach((feature) => bnd.extend(feature.geometry.coordinates[0]));
    return this.checkBounds(bnd);
  }

  zoomOnCountry(countryCode: string) {
    let platformsConsidered = this.platforms.filter(platform => platform.codeCountry===countryCode);
    this.setZones(platformsConsidered);
    if(platformsConsidered.length>1){
      this.bounds$=this.layerZones$.map(layerZones => this.zoomToZonesOrStation(layerZones));
    } else {
      this.bounds$=of(this.zoomToCountries(this.markersCountries.filter(mk => mk.country===countryCode).map(mk => mk.lngLat)));
    }
  }

  setZones(platforms: Platform[]) {
    this.zones = [];
    for (let p of platforms) {
      this.zones = [...this.zones, ...p.zones];
    }
    this.layerZones$ = of(Turf.featureCollection(this.zones.map(zone => Turf.polygon(zone.geometry.coordinates,{code: zone.properties.code}))));
  }

  setStations(platforms: Platform[]) {
    this.stations = [];
    for (let p of platforms) {
      this.stations = [...this.stations, ...p.stations];
    }
    this.layerStations$ = of(Turf.featureCollection(this.stations.map(station => Turf.point(station.geometry.coordinates,{code: station.properties.code}))));
  }

  checkBounds(bounds: LngLatBounds){
    if(bounds.getNorthEast().lng<bounds.getSouthWest().lng){
      let tmp = bounds.getSouthWest().lng;
      bounds.setSouthWest(new LngLat(bounds.getNorthEast().lng,bounds.getSouthWest().lat));
      bounds.setNorthEast(new LngLat(tmp,bounds.getNorthEast().lat));
    }
    if(bounds.getNorthEast().lat<bounds.getSouthWest().lat){
      let tmp = bounds.getSouthWest().lat;
      bounds.setSouthWest(new LngLat(bounds.getSouthWest().lng,bounds.getNorthEast().lat));
      bounds.setNorthEast(new LngLat(bounds.getNorthEast().lng,tmp));
    }
    return bounds;
  }

  showPopupZone(evt: MapMouseEvent) {
    console.log((<any>evt).features[0].geometry.coordinates[0][0]);
    this.selectedZone = (<any>evt).features[0];
  }

  showPopupStation(evt: MapMouseEvent) {
    console.log((<any>evt).features[0].geometry.coordinates);
    this.selectedStation = (<any>evt).features[0];
  }
}