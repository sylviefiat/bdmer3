import { Component, OnInit, ChangeDetectionStrategy, Input, Output, ViewChild, OnChanges, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LngLatBounds, LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { Cluster, Supercluster } from 'supercluster';
import * as Turf from '@turf/turf';
import { MapService } from '../../modules/core/services/index';

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';
import { Results, Data } from '../../modules/analyse/models/index';

@Component({
  selector: 'bc-result-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="container">
    <div *ngIf="loading">Map is loading</div>
    <mgl-map *ngIf="!loading"
        [style]="'mapbox://styles/mapbox/satellite-v9'"
        [fitBounds]="bounds$ | async"
        [fitBoundsOptions]="{
          padding: boundsPadding,
          maxZoom: zoomMaxMap
        }"
        (zoomEnd)="zoomChange($event)">
        <ng-container *ngIf="showStations && (layerStations$ | async)">
          <mgl-geojson-source
            id="layerStations"
            [data]="layerStations$ | async">
            
            <mgl-layer
                *ngIf="typeShow==='A'"
                id="stationId_abun"
                type="circle"
                source="layerStations"
                [paint]="{
                  'circle-color': {
                      property: 'abundancy',
                      type: 'interval',
                      stops: [
                        [0, '#FFEDA0'],
                        [1, '#FD8D3C'],
                        [10, '#800026']
                      ]
                  },
                  'circle-radius': {
                      property: 'abundancy',
                      type: 'interval',
                      stops: [
                          [0, 4],
                          [1, 8],
                          [10, 12]
                      ]
                  }
            }">
            </mgl-layer>
            <mgl-layer
                *ngIf="typeShow==='B'"
                id="stationId_biom"
                type="circle"
                source="layerStations"
                [paint]="{
                  'circle-color': {
                      property: 'biomass',
                      type: 'interval',
                      stops: [
                        [0, '#FFEDA0'],
                        [1, '#FD8D3C'],
                        [10, '#800026']
                      ]
                  },
                  'circle-radius': {
                      property: 'biomass',
                      type: 'interval',
                      stops: [
                          [0, 4],
                          [1, 8],
                          [10, 12]
                      ]
                  }
            }">
            </mgl-layer>
            <mgl-layer
              id="stationValue"
              type="symbol"
              source="layerStations"
              [layout]="{
                'text-field': typeShow==='B'?'{biomass}':'{abundancy}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }">
            </mgl-layer> 
          </mgl-geojson-source>
        </ng-container>
        <ng-container *ngIf="(layerZones$ | async) && showZones">
          <mgl-geojson-source
            id="layerZones"
            [data]="layerZones$ | async">
            <mgl-layer
              *ngIf="typeShow==='A'"
              id="zonesid_abun"
              type="fill"
              source="layerZones"
              [paint]="{
                'fill-color': {
                  property: 'abundancy',
                    type: 'interval',
                    stops: [
                      [0, '#FFEDA0'],
                      [1, '#FD8D3C'],
                      [10, '#800026']
                    ]
                },
                'fill-opacity': 0.3,
                'fill-outline-color': '#000'
                }"
              (click)="selectZone($event)">
            </mgl-layer>
            <mgl-layer
              *ngIf="typeShow==='B'"
              id="zonesid_biom"
              type="fill"
              source="layerZones"
              [paint]="{
                'fill-color': {
                  property: 'biomass',
                    type: 'interval',
                    stops: [
                      [0, '#FFEDA0'],
                      [1, '#FD8D3C'],
                      [10, '#800026']
                    ]
                },
                'fill-opacity': 0.3,
                'fill-outline-color': '#000'
                }"
              (click)="selectZone($event)">
            </mgl-layer>
            <mgl-layer
              id="zonestext"
              type="symbol"
              source="layerZones"
              [layout]="{
                'text-field': '{code}',
                'text-allow-overlap': true,
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
      </mgl-map>
   </div>
  `,
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
    }
    .popup {
      color: black;
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
  @Output() zoneEmitter = new EventEmitter<string>();
  stations: any[] = [];
  zones: any[] = [];
  layerStations$: Observable<Turf.FeatureCollection>;
  layerZones$: Observable<Turf.FeatureCollection>;
  bounds$: Observable<LngLatBounds>;
  boundsPadding: number = 20;
  zoomMaxMap = 10;
  zoom: number = 9;
  selectedPoint: any;

  constructor() {

  }

  zoomChange(event) {
    this.zoom = event.target.getZoom();
  }

  ngOnInit() {
    console.log(this.results);
    this.initStations();
    this.initZones();
    this.filterFeaturesCollection();
  }

  ngOnChanges(event) {
    this.filterFeaturesCollection();
  }

  initStations() {
    if (this.stations.length <= 0) {
      for (let i in this.results.resultPerSurvey) {
        for (let rsp of this.results.resultPerSurvey[i].resultPerSpecies) {
          for (let rt of rsp.resultPerStation) {
            //if (rt.densityPerHA >= 0 && rt.biomassPerHA >= 0) {
              let s: Station = this.analyseData.usedStations.filter((station: Station) => station.properties.code === rt.codeStation) && this.analyseData.usedStations.filter(station => station.properties.code === rt.codeStation)[0];
              let marker = MapService.getFeature(s, {
                  code: s.properties.code,
                  abundancy: rt.abundancePerHA,
                  biomass: rt.biomassPerHA,
                  species: rsp.codeSpecies,
                  survey: this.results.resultPerSurvey[i].codeSurvey
                })
              
              this.stations.push(marker);
            //}
          }
        }
      }
    }
  }

  initZones(){
    if(this.zones.length <=0 ){
      for (let i in this.results.resultPerSurvey) {
        for (let rsp of this.results.resultPerSurvey[i].resultPerSpecies) {
          for (let rz of rsp.resultPerZone) {
            //if (rz.densityPerHA >= 0 && rz.biomassPerHA >= 0) {
              let z: Zone = this.analyseData.usedZones.filter((zone: Zone) => zone.properties.code === rz.codeZone) && this.analyseData.usedZones.filter((zone: Zone) => zone.properties.code === rz.codeZone)[0];
              let polygon = {
                geometry: z.geometry,
                properties: {
                  code: z.properties.code,
                  abundancy: rz.abundancePerHA,
                  biomass: rz.biomassPerHA,
                  species: rsp.codeSpecies,
                  survey: this.results.resultPerSurvey[i].codeSurvey
                }
              };
              this.zones.push(polygon);
            //}
          }
        }
      }
    }
  }

  filterFeaturesCollection() {
    // stations
    let filteredStations = this.stations
        .filter(marker => marker.properties.species === this.spShow && marker.properties.survey === this.surveyShow );
    let featureCollection = Turf.featureCollection(filteredStations);
    console.log(featureCollection);
    this.layerStations$ = of(featureCollection);
    // zones
    let fc2 = Turf.featureCollection(
      this.zones
        .filter(zone => zone.properties.species === this.spShow && zone.properties.survey === this.surveyShow)
        .map(zone => MapService.getPolygon(zone,{code: zone.properties.code, abundancy: zone.properties.abundancy, biomass: zone.properties.biomass}))
        .filter(polygon => polygon !== null)
    );
    console.log(fc2);
    this.layerZones$ = of(fc2);
    // bounds
    var bnd = new LngLatBounds();
    this.stations.forEach((marker) => bnd.extend(marker.geometry.coordinates));
    this.bounds$ = of(bnd);
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

  getUnit(){
    switch (this.typeShow) {
      case "B":
        return "Kg/ha";
      case "A":
        return "Holot./ha";
      default:
        return 0;
    }
  }

  selectZone(evt: MapMouseEvent){
    let selected = (<any>evt).features[0];
    this.zoneEmitter.emit(selected.properties.code);
  }


}
