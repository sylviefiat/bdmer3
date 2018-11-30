import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subscription, pipe, of } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { LngLatBounds, Layer, LngLat, MapMouseEvent, Map } from "mapbox-gl";
import * as Turf from "@turf/turf";

import { RouterExtensions, Config } from "../../modules/core/index";
import { MapService } from "../../modules/core/services/map.service";
import { Platform, Zone, Station, Count } from "../../modules/datas/models/index";
import { Country, Coordinates } from "../../modules/countries/models/country";
import { IAppState } from "../../modules/ngrx/index";

@Component({
  moduleId: module.id,
  selector: 'bc-count-import-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'count-import-preview-map.component.html',
  styleUrls: ['../maps.css']
})
export class PreviewMapCountImportComponent implements OnInit, OnChanges {
  @Input() platform: Platform;
  @Input() countries: Country[];
  @Input() newCounts: Count[];
  @Input() importError: string[];
  @Input() error: string;

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
  layerZones$: Observable<Turf.FeatureCollection>;
  stations: Station[] = [];
  stationsCount: Station[] = [];
  layerStationsCount$: Observable<Turf.FeatureCollection>;
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
    if (!(this.importError.length > 0 || this.error !== null) && this.newCounts && typeof this.newCounts !== "string") {
      this.init();
    }
  }

  setMap(event) {
    this.map = event;
    if (this.bounds) {
      this.map.fitBounds(this.bounds, { padding: 10 });
    }
  }

  zoomChange(event) {
    this.zoom = event.target.getZoom();

    if (this.zoom <= this.zoomMinCountries) this.show = [...this.show.filter(s => s !== "countries"), "countries"];
    if (this.zoom <= this.zoomMaxStations && this.zoom > this.zoomMinCountries)
      this.show = [...this.show.filter(s => s !== "countries" && s !== "zones" && s !== "zonestext"), "countries", "zones", "zonestext"];
    if (this.zoom > this.zoomMaxStations) this.show = [...this.show.filter(s => s !== "zones" && s !== "stations" && s!== "stationsnew" && s !== "zonestext"), "zones", "stations","stationsnew", "zonestext"];
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
      this.stations = this.platform.stations;
      if (this.newCounts !== null && this.newCounts.length > 0) {

        this.stations.forEach(station => {
          this.newCounts.forEach(count => {
            if(this.stations.filter(s => s.properties.code === count.codeStation).length > 0 && this.stationsCount.filter(sc => sc.properties.code === count.codeStation).length<=0){
              this.stationsCount.push(this.stations.filter(s => s.properties.code === count.codeStation)[0]);
              this.stationsCount = [...this.stationsCount.filter(sc => sc.properties.code !)]
            }
          });
        });
      }

      let country = this.countries.filter(country => country.code === this.platform.codeCountry)[0];

      this.markerCountry = {
        country: country.code,
        name: country.name,
        lngLat: [country.coordinates.lng, country.coordinates.lat]
      };

      if (this.platform.zones.length > 0) this.setZones(this.platform);
      if (this.stations.length > 0) this.setStations(this.stations);
      if (this.stationsCount.length > 0) this.setStationsCount(this.stationsCount);
    }
  }

  setZones(platform: Platform) {
        this.zones = this.platform.zones;
        let lz = Turf.featureCollection(
            this.zones
                .filter(zone => zone !== null)
                .map(zone => MapService.getFeature(zone, { code: zone.properties.id ? zone.properties.id : zone.properties.code })));
        this.layerZones$ = of(lz);
        this.bounds = MapService.zoomToZones(lz);
    }

  setStations(stations: Station[]) {
    //this.stations = this.platform.stations;
    let fc = Turf.featureCollection(stations.map(station => Turf.point(station.geometry.coordinates, { code: station.properties.code })))
    this.layerStations$ = of(fc);
    this.bounds = MapService.zoomToStations(fc);
  }

  setStationsCount(stations: Station[]) {
    let fc = Turf.featureCollection(stations.map(station => Turf.point(station.geometry.coordinates, { code: station.properties.code })));
    this.layerStationsCount$ = of(fc);
    this.bounds = MapService.zoomToStations(fc);
  }

  showPopupStation(evt: MapMouseEvent) {
    this.selectedStation = (<any>evt).features[0];
  }
}
