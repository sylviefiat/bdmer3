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
  moduleId: module.id,
  selector: 'bc-zone-form-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'zone-form-preview-map.component.html',
  styleUrls: ['../maps.css']  
})
export class PreviewMapZoneFormComponent implements OnInit, OnChanges {
  @Input() platform: Platform;
  @Input() countries: Country[];
  @Input() newZone: any;
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
    console.log(this.newZone);

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
    this.bounds = this.checkBounds(bnd.extend(coordinates[0]));
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

  zoomToCountries(coordinates): LngLatBounds {
    return coordinates.reduce((bnd, coord) => {
      return bnd.extend(<any>coord);
    }, new LngLatBounds(coordinates[0], coordinates[0]));
  }

  zoomToZones(featureCollection) {
    var bnd = new LngLatBounds();
    var fc: Turf.FeatureCollection = featureCollection.features.forEach(feature => {
      feature.geometry.coordinates[0].forEach(coord => {
        bnd.extend(coord);
      });
    });
    this.bounds = this.checkBounds(bnd);
  }

  zoomToStations(featureCollection) {
    var bnd = new LngLatBounds();
    var fc: Turf.FeatureCollection = featureCollection.features.forEach(feature => bnd.extend(feature.geometry.coordinates));
    this.bounds = this.checkBounds(bnd);
  }

  zoomOnCountry(countryCode: string) {
    this.bounds = this.zoomToCountries([this.markerCountry.lngLat]);
  }

  setZones(platform: Platform) {
    this.zones = this.platform.zones;
    this.layerZones$ = of(Turf.featureCollection(this.zones.map(zone => Turf.polygon(zone.geometry.coordinates, { code: zone.properties.code }))));
    this.zoomToZones(Turf.featureCollection(this.zones.map(zone => Turf.polygon(zone.geometry.coordinates, { code: zone.properties.code }))));
  }

  setStations(platform: Platform) {
    this.stations = this.platform.stations;
    this.layerStations$ = of(
      Turf.featureCollection(this.stations.map(station => Turf.point(station.geometry.coordinates, { code: station.properties.code })))
    );
    this.zoomToStations(
      Turf.featureCollection(this.stations.map(station => Turf.point(station.geometry.coordinates, { code: station.properties.code })))
    );
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
