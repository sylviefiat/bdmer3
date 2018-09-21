import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subscription, pipe, of } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { LngLatBounds, Layer, LngLat, MapMouseEvent, Map } from "mapbox-gl";
import * as Turf from "@turf/turf";

import { RouterExtensions, Config } from "../../modules/core/index";
import { MapService } from "../../modules/core/services/map.service";
import { Platform, Zone, Station } from "../../modules/datas/models/index";
import { Country, Coordinates } from "../../modules/countries/models/country";
import { IAppState } from "../../modules/ngrx/index";

@Component({
    selector: "bc-station-import-map",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
  <div [className]="isLoading?'loading':'hide'"></div>
  <nav id="switcher">
    <a (click)="changeView('zones')" [class.isOn]="isDisplayed('zones')">{{'ZONES' | translate}}</a>
    <a  (click)="changeView('stations')" [class.isOn]="isDisplayed('stations')">{{'STATIONS' | translate}}</a>
    <a (click)="changeBL()" [class.isOn]="!bl" title="{{'SATELLITE' | translate}}"><fa [name]="'globe'" [border]=false [size]=1></fa></a>
    <a (click)="changeBL()" [class.isOn]="bl" title="{{'STREETS' | translate}}"><fa [name]="'map'" [border]=false [size]=1></fa></a>
  </nav>
  <mgl-map 
    [style]="bls[bl]"
    [fitBounds]="bounds"
    [fitBoundsOptions]="{
      padding: boundsPadding,
      maxZoom: zoomMaxMap
    }"
    (load) = "setMap($event)"
    (zoomEnd)="zoomChange($event)"
    (data)="styleChange($event)">
    <ng-container>
      <mgl-marker
        [lngLat]="markerCountry.lngLat">
        <div
          (click)="zoomOnCountry(markerCountry.country)"
          class="marker">
          <fa [name]="'map-marker'" [border]=false [size]=3></fa><br/>
          <span>{{markerCountry.name}}</span>
        </div>
      </mgl-marker>
    </ng-container>

    <ng-container>
      <mgl-marker *ngFor="let marker of newStationsPreviewValid"
        [lngLat]="marker.geometry.coordinates">
        <div
          class="markerValid">
          <fa [name]="'map-marker'" [border]=false [size]=2></fa><br/>
        </div>
      </mgl-marker>
    </ng-container>

    <ng-container>
      <mgl-marker *ngFor="let marker of newStationsPreviewInvalid"
        [lngLat]="marker.geometry.coordinates">
        <div
          class="markerInvalid">
          <fa [name]="'map-marker'" [border]=false [size]=2></fa><br/>
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
            }"
          (mouseEnter)="cursorStyle = 'pointer'"
          (mouseLeave)="cursorStyle = ''">
        </mgl-layer>
        
      </mgl-geojson-source>
    </ng-container>
    <ng-container *ngIf="newStationPreview">
      <mgl-marker
        [lngLat]="newStationPreview.geometry.coordinates">
        <div
           [ngStyle]="{ 'color': newStationPreviewColor() }">
          <fa [name]="'map-marker'" [border]=false [size]=2></fa><br/>
        </div>
      </mgl-marker>
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
            'icon-allow-overlap': true,
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
      height: 50vh;
      width: 100%;
    }
    .mapboxgl-popup-content {
      color:black;
    }
    .marker{
        color: white;
    }
    .markerValid{
      color: green;
    }
    .markerInvalid{
      color: orange;
    }
    .markerNew{
      color: green
    }
    .marker:hover {
      cursor = 'pointer';
    }
    #switcher {
        background: #fff;
        display:flex;
        justify-content: flex-end;
        z-index: 1;
        font-family: 'Open Sans', sans-serif;
    }

    #switcher a {
        margin-left: 2px;
        font-size: 13px;
        color: #404040;
        display: block;
        margin: 0;
        padding: 0;
        padding: 10px;
        text-decoration: none;
        border: 1px solid rgba(0,0,0,0.25);
        text-align: center;
    }

    #switcher a:hover {
        background-color: #f8f8f8;
        color: #404040;
    }

    #switcher a.isOn {
        background-color: #106cc8;
        color: #ffffff;
    }

    #switcher a.isOn:hover {
        background: #3074a4;
    }
    #switcher .subswitch {
      display:flex;
      flex-direction:row;
    }
    #switcher .subswitch a {
      width:50%
    }
    #stationsidpreview{
      color: red
    }
    .hide {
      display:none;
    }
    .loading{
      display: inline-block;
      width: 64px;
      height: 64px;
    }
    .loading:after {
      content: " ";
      display: block;
      width: 46px;
      height: 46px;
      margin: 1px;
      border-radius: 50%;
      border: 5px solid #106cc8;
      border-color: #106cc8 transparent #106cc8 transparent;
      animation: lds-dual-ring 1.2s linear infinite;
    }
    @keyframes loading {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    `
    ]
})
export class PreviewMapStationImportComponent implements OnInit, OnChanges {
    @Input() platform: Platform;
    @Input() countries: Country[];
    @Input() newStations: Station[];
    @Input() importError: string[];
    @Input() error: string;
    @Output() newStationInvalid: EventEmitter<any> = new EventEmitter<any>();

    bounds: LngLatBounds;
    boundsPadding: number = 100;
    map: any;
    isLoading = false;

    zoomMaxMap: number = 10;
    zoom = 9;
    zoomMinCountries: number = 4;
    zoomMinStations: number = 3;
    zoomMaxStations: number = 5;
    selectedStation: GeoJSON.Feature<GeoJSON.Point> | null;
    selectedZone: GeoJSON.Feature<GeoJSON.Polygon> | null;
    colorPreview: Object;
    markerCountry: any;
    zones: Zone[] = [];
    newStationsPreviewInvalid: any[] = [];
    newStationsPreviewValid: any[] = [];
    layerZones$: Observable<Turf.FeatureCollection>;
    stations: Station[] = [];
    layerStations$: Observable<Turf.FeatureCollection>;
    show: string[] = ["countries"];
    tmp: string[] = [];
    bls: string[] = ["mapbox://styles/mapbox/satellite-v9", "mapbox://styles/mapbox/streets-v9"];
    bl: number;

    constructor() {
        this.bl = 0;
    }

    ngOnInit() {
        this.init();
    }

    ngOnChanges() {
        if (this.importError.length > 0 || this.error !== null) {
            this.reset();
        } else {
            if (this.newStations) {
                if (typeof this.newStations !== "string") {
                    this.init();
                    if (this.newStations) {
                        this.reset();
                        if (this.newStations.length > 0) {
                            this.checkStationsValid(this.newStations);
                            this.bounds = MapService.zoomToStations({ features: this.newStations });
                        }
                    }
                }
            }
        }
    }

    reset() {
        this.newStationsPreviewInvalid = [];
        this.newStationsPreviewValid = [];
    }

    setMap(event) {
        this.map = event;
        if (this.bounds) {
            this.map.fitBounds(this.bounds, { padding: 10 });
        }
    }

    newStationsPreviewColor() {
        if (this.newStationsPreviewValid) {
            return "green";
        } else {
            return "orange";
        }
    }

    checkStationsValid(stations) {
        this.isLoading = true;
        let inside = false, i = 0;
        this.platform.zones.forEach(zone => {
          for(let station of stations){
            if (MapService.booleanInPolygon(station, MapService.getPolygon(zone, { name: zone.properties.name }))) {
              this.newStationsPreviewValid.push(Turf.point(station.geometry.coordinates));
              stations = [...stations.filter(st => st.properties.code !== station.properties.code)];
            }
          }
        });
        this.newStationsPreviewInvalid = [...stations];
        this.newStationInvalid.emit(this.newStationsPreviewInvalid.length > 0 ? true : false);
        this.isLoading = false;
    }

    zoomChange(event) {
        this.zoom = event.target.getZoom();
        if (this.zoom <= this.zoomMinCountries) this.show = [...this.show.filter(s => s !== "countries"), "countries"];
        if (this.zoom <= this.zoomMaxStations && this.zoom > this.zoomMinCountries)
            this.show = [...this.show.filter(s => s !== "countries" && s !== "zones"), "countries", "zones"];
        if (this.zoom > this.zoomMaxStations) this.show = [...this.show.filter(s => s !== "zones" && s !== "stations"), "zones", "stations"];
    }

    changeView(view: string) {
        this.show = this.show.indexOf(view) >= 0 ? [...this.show.filter(s => s !== view)] : [...this.show, view];
    }

    isDisplayed(layer: string) {
        return this.show.indexOf(layer) >= 0;
    }

    changeBL() {
        this.bl = this.bl ? 0 : 1;
        // Remove all the layers to reload them on new style when baselayer is loaded
        this.tmp = this.show;
        this.show = [];
    }

    styleChange(event) {
        // when style is loaded put back the layers
        if (event.dataType === "style") {
            if (this.tmp.length > 0) {
                this.show = this.tmp;
                this.tmp = [];
            }
        }
    }

    init() {
        if (this.countries.length > 0) {
            let country = this.countries.filter(country => country.code === this.platform.codeCountry)[0];

            this.markerCountry = {
                country: country.code,
                name: country.name,
                lngLat: [country.coordinates.lng, country.coordinates.lat]
            };

            if (this.platform.zones.length > 0) this.setZones(this.platform);
            if (this.platform.stations.length > 0) this.setStations(this.platform);
        }
    }

    zoomOnCountry(countryCode: string) {
        this.bounds = MapService.zoomToCountries([this.markerCountry.lngLat]);
    }

    setZones(platform: Platform) {
        this.zones = this.platform.zones;
        let fc = Turf.featureCollection(this.zones.map(zone => MapService.getPolygon(zone, { code: zone.properties.code })))
        this.layerZones$ = of(fc);
        this.bounds = MapService.zoomToZones(fc);
    }

    setStations(platform: Platform) {
        this.stations = this.platform.stations;
        let fc = Turf.featureCollection(this.stations.map(station => Turf.point(station.geometry.coordinates, { code: station.properties.code })));
        this.layerStations$ = of(fc);
        this.bounds = MapService.zoomToStations(fc);
    }

    showPopupStation(evt: MapMouseEvent) {
        this.selectedStation = (<any>evt).features[0];
    }
}
