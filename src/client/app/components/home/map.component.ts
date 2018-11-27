import { Component, OnInit, ViewChild, Input, OnChanges, ChangeDetectionStrategy } from "@angular/core";
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "bc-home-map",
  templateUrl: "map.component.html",
  styleUrls: ["map.component.css"]
})
export class MapComponent implements OnInit, OnChanges {
  @Input() platforms: Platform[];
  @Input() countries: Country[];
  @Input() isAdmin: boolean;

  bounds$: Observable<LngLatBounds>;
  boundsPadding: number = 20;

  zoomMaxMap: number = 10;
  zoom = 9;
  zoomMinCountries: number = 4;
  zoomMinStations: number = 11;
  zoomMaxStations: number = 5;
  zoomMinZones: number = 4;
  zoomMaxZones: number = 5;
  selectedStation: GeoJSON.Feature<GeoJSON.Point> | null;
  selectedZone: GeoJSON.Feature<GeoJSON.Polygon> | null;

  markersCountries: any[] = [];
  zones: Zone[] = [];
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
    this.init();
  }

  zoomChange(event) {
    this.zoom = event.target.getZoom();
    if(this.zoom<=this.zoomMinCountries) this.show=[...this.show.filter(s => s!=='countries'&&s!=='zones'&&s!=='stations'),'countries'];
    if(this.zoom<=this.zoomMinStations && this.zoom>this.zoomMinZones) this.show=[...this.show.filter(s=> s!=='countries'&&s!=='zones'&&s!=='stations'),'countries','zones'];
    if(this.zoom>this.zoomMinStations) this.show=[...this.show.filter(s=>s!=='zones'&&s!=='stations'),'zones','stations'];
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
      this.markersCountries = this.countries.filter(country => country.code !== "AA" && country.coordinates && country.coordinates.lng && country.coordinates.lat).map(country => ({
        country: country.code,
        name: country.name,
        lngLat: [country.coordinates.lng, country.coordinates.lat]
      }));
      if (this.platforms.length > 0) {
        this.setZones(this.platforms);
        this.setStations(this.platforms);
      }


      if (this.markersCountries.length === 1 && this.platforms.length > 0) {
        this.bounds$ = this.layerZones$.map(layerZones => this.zoomToZonesOrStation(layerZones));
      } else  if(this.markersCountries.length >= 1){
        this.bounds$ = of(this.zoomToCountries(this.markersCountries.map(mk => mk.lngLat)));
      }
    }
  }

  zoomToCountries(coordinates): LngLatBounds {
    return coordinates.reduce((bnd, coord) => {
      return bnd.extend(<any>coord);
    }, new LngLatBounds(coordinates[0], coordinates[0]));
  }

  zoomToZonesOrStation(featureCollection) {
    var bnd = new LngLatBounds();
    if(featureCollection.features !== null){      
      var fc: Turf.FeatureCollection = featureCollection.features
      .filter(feature => feature && feature.geometry && feature.geometry.coordinates)
      .forEach((feature) => bnd.extend(MapService.zoomOnZone(feature)));
      return MapService.checkBounds(bnd);
    } 
    return bnd;
  }

  zoomOnCountry(countryCode: string) {
    let platformsConsidered = this.platforms.filter(platform => platform.codeCountry === countryCode);
    this.setZones(platformsConsidered);
    if (platformsConsidered.length > 1) {
      this.bounds$ = this.layerZones$.map(layerZones => this.zoomToZonesOrStation(layerZones));
    } else {
      this.bounds$ = of(this.zoomToCountries(this.markersCountries.filter(mk => mk.country === countryCode).map(mk => mk.lngLat)));
    }
  }

  setZones(platforms: Platform[]) {
    this.zones = [];
    for (let p of platforms) {
      if(p.zones && p.zones.length>0){
        this.zones = [...this.zones, ...p.zones];
      }
    }
    this.layerZones$ = of(
      Turf.featureCollection(
        this.zones
          .filter(zone=> zone!==null)
          .map(zone => MapService.getFeature(zone,{id:zone.properties.id,code: zone.properties.code}))));
  }

  setStations(platforms: Platform[]) {
    this.stations = [];
    for (let p of platforms) {
      if(p.stations && p.stations.length>0){
        this.stations = [...this.stations, ...p.stations];
      }
    }
    this.layerStations$ = of(
      Turf.featureCollection(
        this.stations
          .map(station => MapService.getFeature(station,{ code: station.properties.code}))));
  }

  showPopupStation(evt: MapMouseEvent) {
    this.selectedStation = (<any>evt).features[0];
  }
}
