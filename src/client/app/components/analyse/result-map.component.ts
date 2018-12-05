import { Component, OnInit, ChangeDetectionStrategy, Input, Output, ViewChild, OnChanges, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LngLatBounds, LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { Cluster, Supercluster } from 'supercluster';
import * as Turf from '@turf/turf';
import { saveAs } from 'file-saver';
import { MapService } from '../../modules/core/services/index';

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';
import { Results, Data } from '../../modules/analyse/models/index';

@Component({
  moduleId: module.id,
  selector: 'bc-result-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'result-map.component.html',
  styles: [
    `
   mgl-map {
      width: 800px;
      height: 500px;
      border: 1px solid black;
    }
    .marker{
      color:white;
    }
    .marker.selected{
      color:red;
    }
    .container {
      display: flex;
      margin-left: 20px;
      margin-right: 20px;
      flex-direction:row-reverse;
    }
    .popup {
      color: black;
    }
    #menu {
      margin-left: -58px;
      z-index: 1;
      font-family: 'Open Sans', sans-serif;
    }
  `]
})
export class ResultMapComponent implements OnInit, OnChanges {
  @Input() results: Results;
  @Input() analyseData: Data;
  @Input() typeShow: string;
  @Input() spShow: string;
  @Input() surveyShow: string;
  @Input() showStations: boolean;
  @Input() showZones: boolean;
  @Input() showZonesNoRatio: boolean;
  @Input() showBiom: boolean;
  @Output() zoneEmitter = new EventEmitter<string>();
  stations: any[] = [];
  zones: any[] = [];
  layerStations$: Observable<Turf.FeatureCollection>;
  layerZones$: Observable<Turf.FeatureCollection>;
  layerZonesNoRatio$: Observable<Turf.FeatureCollection>;
  bounds: LngLatBounds;
  boundsPadding: number = 50;
  zoomMaxMap = 10;
  zoom: number = 9;
  map: any;
  selectedStation: GeoJSON.Feature<GeoJSON.Point> | null;
  selectedZone: GeoJSON.Feature<GeoJSON.Point> | null;
  private docs_repo: string;
  private imgs_repo: string;
  stripes_img = 'stripes.png';
  imageLoaded$ : Observable<boolean>;

  constructor(mapService: MapService) {
    this.docs_repo = '../../../assets/files/';
    this.imgs_repo = '../../../assets/img/';
    this.imageLoaded$ = of(false);
  }

  zoomChange(event) {
    this.zoom = event.target.getZoom();
  }

  getStripes() {
    return this.imgs_repo + this.stripes_img;
  }

  isLoaded(event){
    this.imageLoaded$ = of(true);
  }

  ngOnInit() {
    console.log(this.results);
    this.initStations();
    this.initZones();
    this.filterFeaturesCollection();
  }

  setMap(event) {
    this.map = event;
    if (this.bounds) {
      this.map.fitBounds(this.bounds, { padding: 10 });
    }
    //console.log(this.map.getCanvas().toDataURL());
  }

  ngOnChanges(event) {
    this.filterFeaturesCollection();
  }

  initStations() {
    if (this.stations.length <= 0) {
      for (let i in this.results.resultPerSurvey) {
        for (let rsp of this.results.resultPerSurvey[i].resultPerSpecies) {
          for (let rt of rsp.resultPerStation) {
            let s: Station = this.analyseData.usedStations.filter((station: Station) => station.properties.code === rt.codeStation) && this.analyseData.usedStations.filter(station => station.properties.code === rt.codeStation)[0];
            let marker = MapService.getFeature(s, {
              code: s.properties.code,
              abundancy: rt.abundancePerHA,
              biomass: rt.biomassPerHA,
              species: rsp.codeSpecies,
              survey: this.results.resultPerSurvey[i].codeSurvey
            })

            this.stations.push(marker);
          }
        }
      }
    }
  }

  initZones() {
    if (this.zones.length <= 0) {
      for (let i in this.results.resultPerSurvey) {
        for (let rsp of this.results.resultPerSurvey[i].resultPerSpecies) {
          for (let rz of rsp.resultPerZone) {
            let z: Zone = this.analyseData.usedZones.filter((zone: Zone) => zone.properties.code === rz.codeZone) && this.analyseData.usedZones.filter((zone: Zone) => zone.properties.code === rz.codeZone)[0];
            let polygon = {
              geometry: z.geometry,
              properties: {
                code: z.properties.code,
                abundancy: rz.abundancePerHA,
                biomass: rz.biomassPerHA,
                species: rsp.codeSpecies,
                survey: this.results.resultPerSurvey[i].codeSurvey,
                ratio: rz.ratioNstSurface
              }
            };
            this.zones.push(polygon);
          }
        }
      }
    }
  }

  filterFeaturesCollection() {
    // stations
    let filteredStations = this.stations
        .filter(marker => (this.spShow===null || marker.properties.species === this.spShow) && 
          (this.surveyShow===null || marker.properties.survey === this.surveyShow) );
    let featureCollection = Turf.featureCollection(filteredStations);
    this.layerStations$ = of(featureCollection);
    // zones
    let filteredZones = this.zones
        .filter(zone => (this.spShow===null || zone.properties.species === this.spShow) && 
          (this.surveyShow===null || zone.properties.survey === this.surveyShow))
        .map(zone => MapService.getPolygon(zone,{code: zone.properties.code, abundancy: zone.properties.abundancy, biomass: zone.properties.biomass, ratio: zone.properties.ratio}))
        .filter(polygon => polygon !== null);
    // zones not taken into stock evaluation are stiped (ratio is <0.2)
    let filteredZonesWithoutRatio = this.zones
        .filter(zone => {
          console.log(zone.properties.ratio);
          console.log(zone.properties.ratio<0.2);
          return (this.spShow===null || zone.properties.species === this.spShow) && 
          (this.surveyShow===null || zone.properties.survey === this.surveyShow) && (zone.properties.ratio<0.2)})
        .map(zone => MapService.getPolygon(zone,{code: zone.properties.code, abundancy: zone.properties.abundancy, biomass: zone.properties.biomass, ratio: zone.properties.ratio}))
        .filter(polygon => polygon !== null);
    let fc1 = Turf.featureCollection(filteredZones);
    let fc1No = Turf.featureCollection(filteredZonesWithoutRatio);
    this.layerZones$ = of(fc1);
    this.layerZonesNoRatio$ = of(fc1No);
    if(filteredZones.length > 0){      
      this.bounds = MapService.zoomToZones(fc1);
    } 
  }

  getValue(feature) {
    switch (this.typeShow) {
      case "B":
        return Math.round(feature.properties.biomass);
      case "A":
        return Math.round(feature.properties.abundancy);
      default:
        return 0;
    }
  }

  getUnit() {
    switch (this.typeShow) {
      case "B":
        return "Kg/ha";
      case "A":
        return "Holot./ha";
      default:
        return 0;
    }
  }

  selectStation(evt: MapMouseEvent) {
    this.selectedStation = (<any>evt).features[0];
  }

  selectZone(evt: MapMouseEvent) {
    this.selectedZone = (<any>evt).features[0];
    this.zoneEmitter.emit(this.selectedZone.properties.code);
  }

  selectZoneCoordinates() {
    return MapService.getCoordinates(this.selectedZone)[0][0];
  }

  exportMap(){
    this.map.getCanvas().toBlob(function (blob) {
      saveAs(blob, 'map.png');
    })
  }


}
