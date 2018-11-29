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
import { MapService } from "../../modules/core/services/index";

@Component({
  moduleId: module.id,
  selector: 'bc-zone-form-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'zone-form-preview-map.component.html',
  styleUrls: ['../maps.css']
})
export class PreviewMapZoneFormComponent implements OnInit, OnChanges {
  @Input() platform: Platform;
  @Input() countries: Country[];
  @Input() newZone: Zone;
  @Output() zoneIntersect: EventEmitter<any> = new EventEmitter<any>();

  bounds: LngLatBounds;
  boundsPadding: number = 100;
  map: any;

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
    if (this.newZone !== null && this.newZone) {
      this.createZone(this.newZone);
      this.checkZoneValid(this.newZone);
    } else {
      this.newZonePreview = null;
    }

    this.init();
  }

  setMap(event) {
    this.map = event;
    if (this.bounds) {
      this.map.fitBounds(this.bounds, { padding: 10 });
    }
  }

  checkZoneValid(zoneCheck) {
    this.colorPreview = {
      "fill-color": "green",
      "fill-opacity": 0.5,
      "fill-outline-color": "#000"
    };

    if (MapService.isZoneInError(zoneCheck, this.platform)) {
      this.zoneIntersect.emit(true);

      this.colorPreview = {
        "fill-color": "red",
        "fill-opacity": 0.5,
        "fill-outline-color": "#000"
      };
    }
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

    this.bounds = MapService.zoomOnZone(coordinates);
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

      if (this.platform.stations.length > 0) this.setStations(this.platform);
      if (this.platform.zones.length > 0) this.setZones(this.platform);
    }
  }

  zoomOnCountry(countryCode: string) {
    this.bounds = MapService.zoomToCountries(this.markerCountry.lngLat)
  }

  setZones(platform: Platform) {
    this.zones = this.platform.zones;
    let fc = Turf.featureCollection(this.zones.map(zone => Turf.polygon(zone.geometry.coordinates, { code: zone.properties.code })));
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
