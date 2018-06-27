import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subscription, pipe, of } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { LngLatBounds, Layer, LngLat, MapMouseEvent, Map } from "mapbox-gl";
import * as Turf from "@turf/turf";

import { RouterExtensions, Config } from "../../modules/core/index";
import { Platform, Zone, Station } from "../../modules/datas/models/index";
import { Country, Coordinates } from "../../modules/countries/models/country";
import { IAppState } from "../../modules/ngrx/index";

@Component({
  selector: "bc-zone-form-map",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <nav id="switcher">
    <a (click)="changeView('zones')" [class.isOn]="isDisplayed('zones')">{{'ZONES' | translate}}</a>
    <a  (click)="changeView('stations')" [class.isOn]="isDisplayed('stations')">{{'STATIONS' | translate}}</a>
    <a (click)="changeBL()" [class.isOn]="!bl" title="{{'SATELLITE' | translate}}"><fa [name]="'globe'" [border]=false [size]=1></fa></a>
    <a (click)="changeBL()" [class.isOn]="bl" title="{{'STREETS' | translate}}"><fa [name]="'map'" [border]=false [size]=1></fa></a>
  </nav>
  <mgl-map
  [style]="bls[bl]"
  [fitBounds]="bounds$ | async"
  [fitBoundsOptions]="{
    padding: boundsPadding,
    maxZoom: zoomMaxMap
  }"
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
    <ng-container *ngIf="newZonePreview && isDisplayed('zones')">
    <mgl-geojson-source
      id="layerPreviewsZone"
      [data]="newZonePreview">
      <mgl-layer
        id="previewzoneid"
        type="fill"
        source="layerPreviewsZone"
        [paint]="colorPreview"
        (mouseEnter)="cursorStyle = 'pointer'"
        (mouseLeave)="cursorStyle = ''">
      </mgl-layer>
      <mgl-layer
        id="previewzonetext"
        type="symbol"
        source="layerPreviewsZone"
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
      height: 50vh;
      width: 100%;
    }
    .mapboxgl-popup-content {
      color:black;
    }
    .marker{
        color: white;
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
    `
  ]
})
export class PreviewMapZoneFormComponent implements OnInit, OnChanges {
  @Input() platform: Platform;
  @Input() countries: Country[];
  @Input() newZone: any[];
  @Output() zoneIntersect: EventEmitter<any> = new EventEmitter<any>();

  bounds$: Observable<LngLatBounds>;
  boundsPadding: number = 100;

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
  newZonePreview: Zone;
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
    if (this.newZone) {
      if (this.newZone[0].length > 0) {
        this.createZone(this.newZone);
        this.checkZoneValid(this.newZone);
      } else {
        this.newZonePreview = null;
      }
    }
    this.init();
  }

  checkZoneValid(zoneCheck) {
    this.colorPreview = {
      "fill-color": "green",
      "fill-opacity": 0.5,
      "fill-outline-color": "#000"
    };

    this.platform.zones.map(zone => {
      if (Turf.intersect(Turf.polygon(zone.geometry.coordinates), Turf.polygon(zoneCheck))) {
        this.zoneIntersect.emit(true);

        this.colorPreview = {
          "fill-color": "red",
          "fill-opacity": 0.5,
          "fill-outline-color": "#000"
        };
      }
    });
  }

  createZone(coordinates) {
    this.newZonePreview = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: coordinates
      },
      properties: {
        name: "",
        code: "",
        surface: 0
      },
      staticmap: "",
      codePlatform: this.platform.code,
      zonePreferences: []
    };

    var bnd = new LngLatBounds();
    this.bounds$ = of(this.checkBounds(bnd.extend(coordinates[0])));
  }

  zoomChange(event) {
    this.zoom = event.target.getZoom();

    if (this.zoom <= this.zoomMinCountries) this.show = [...this.show.filter(s => s !== "countries"), "countries"];
    if (this.zoom <= this.zoomMaxStations && this.zoom > this.zoomMinCountries) this.show = [...this.show.filter(s => s !== "countries" && s !== "zones"), "countries", "zones"];
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

      this.bounds$ = this.layerZones$.map(layerZones => this.zoomToZonesOrStation(layerZones));
    }
  }

  zoomOnCountry() {
    this.bounds$ = this.layerZones$.map(layerZones => this.zoomToZonesOrStation(layerZones));
  }

  zoomToZonesOrStation(featureCollection): LngLatBounds {
    var bnd = new LngLatBounds();
    var fc: Turf.FeatureCollection = featureCollection.features.forEach(feature => {
      bnd.extend(feature.geometry.coordinates[0]);
    });
    return this.checkBounds(bnd);
  }

  setZones(platform: Platform) {
    this.layerZones$ = of(Turf.featureCollection(this.platform.zones.map(zone => Turf.polygon(zone.geometry.coordinates, { code: zone.properties.code }))));
  }

  setStations(platform: Platform) {
    this.layerStations$ = of(Turf.featureCollection(this.platform.stations.map(station => Turf.point(station.geometry.coordinates, { code: station.properties.code }))));
  }

  checkBounds(bounds: LngLatBounds) {
    if (bounds.getNorthEast().lng < bounds.getSouthWest().lng) {
      let tmp = bounds.getSouthWest().lng;
      bounds.setSouthWest(new LngLat(bounds.getNorthEast().lng, bounds.getSouthWest().lat));
      bounds.setNorthEast(new LngLat(tmp, bounds.getNorthEast().lat));
    }
    if (bounds.getNorthEast().lat < bounds.getSouthWest().lat) {
      let tmp = bounds.getSouthWest().lat;
      bounds.setSouthWest(new LngLat(bounds.getSouthWest().lng, bounds.getNorthEast().lat));
      bounds.setNorthEast(new LngLat(bounds.getNorthEast().lng, tmp));
    }
    return bounds;
  }

  showPopupStation(evt: MapMouseEvent) {
    this.selectedStation = (<any>evt).features[0];
  }
}
