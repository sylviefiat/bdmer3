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
  selector: 'bc-zone-import-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'zone-import-preview-map.component.html',
  styleUrls: ['../maps.css'] 
})
export class PreviewMapZoneImportComponent implements OnInit, OnChanges {
  @Input() platform: Platform;
  @Input() countries: Country[];
  @Input() geojsons: any;
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
  newZonesPreviewValid: any = { features: [], type: "FeatureCollection" };
  newZonesPreviewError: any = { features: [], type: "FeatureCollection" };
  layerZones$: Observable<Turf.FeatureCollection>;
  stations: Station[] = [];
  zones: Zone[] = [];
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

    if (this.geojsons) {
      this.reset();
      this.checkZoneValid(this.geojsons);      
    }
  }

  reset() {
    this.newZonesPreviewValid = { features: [], type: "FeatureCollection" };
    this.newZonesPreviewError = { features: [], type: "FeatureCollection" };
  }

  zoomOnCountry(countryCode: string) {
    this.bounds = MapService.zoomToCountries([this.markerCountry.lngLat]);
  }

  checkZoneValid(zonesCheck) {
    for (let zc of zonesCheck) {
      if(MapService.isZoneInError(zc, this.platform)) {          
          this.newZonesPreviewError.features.push(zc);
          zonesCheck=[...zonesCheck.filter(z => z.properties.code!==zc.properties.code)];
        }
    }
    this.newZonesPreviewValid.features = zonesCheck;
    this.bounds = MapService.zoomToZones({ features: [...this.newZonesPreviewError.features,...this.newZonesPreviewValid.features], type: "FeatureCollection" });
    return this.zoneIntersect.emit(this.newZonesPreviewError.features.length>0?'error':'none');
  }

  

  setMap(event) {
    this.map = event;
    if (this.bounds) {
      this.map.fitBounds(this.bounds, { padding: 10 });
    }
  }

  zoomChange(event) {
    this.zoom = event.target.getZoom();
    let ozone = this.newZonesPreviewValid.features.length===0 && this.newZonesPreviewError.features.length ===0 ? "zones" : "zonesnew";
    if (this.zoom <= this.zoomMinCountries) {this.show = [...this.show.filter(s => s !== "countries"), "countries"];}
    if (this.zoom <= this.zoomMaxStations && this.zoom > this.zoomMinCountries){      
      this.show = [...this.show.filter(s => s !== "countries" && s !== "zones" && s !== "zonesnew" && s !== "zonestext"), "countries", ozone, "zonestext"];
    }
    if (this.zoom > this.zoomMaxStations) {
      this.show = [...this.show.filter(s => s !== "zones" && s !== "zonesnew" && s !== "zonestext" && s !== "stations"), ozone, "zonestext", "stations"]
    };
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

  setZones(platform: Platform) {
    this.zones = this.platform.zones;
    let lz =  Turf.featureCollection(
        this.zones
          .filter(zone=> zone!==null)
          .map(zone => MapService.getFeature(zone,{ code: zone.properties.id ? zone.properties.id : zone.properties.code})));
    this.layerZones$ = of(lz);
    this.bounds = MapService.zoomToZones(lz);
  }

  setStations(platform: Platform) {
    this.stations = platform.stations;
    let fc = Turf.featureCollection(this.stations.map(station => MapService.getFeature(station.geometry.coordinates, { code: station.properties.code })))
    this.layerStations$ = of(fc);
    this.bounds = MapService.zoomToStations(fc);
  }


  showPopupStation(evt: MapMouseEvent) {
    this.selectedStation = (<any>evt).features[0];
  }
}
