import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild, EventEmitter, Output, OnChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LngLatBounds, LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { Cluster, Supercluster } from 'supercluster';
import * as Turf from '@turf/turf';

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';
import { Results, Data } from '../../modules/analyse/models/index';

@Component({
  selector: 'bc-result-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="container">
     <mgl-map
        [style]="'mapbox://styles/mapbox/satellite-v9'"
        [fitBounds]="bounds$ | async"
        [fitBoundsOptions]="{
          padding: boundsPadding,
          maxZoom: zoomMaxMap
        }"
        (zoomEnd)="zoomChange($event)"> 
        <ng-container *ngIf="showStations && (markers$ | async)">
          <mgl-marker-cluster
            [data]="markers$ | async"
            [radius]="50"
            (load)="load($event)">
            <ng-template mglPoint let-feature>
              <div
                class="marker"
                [class.marker-small]="getValue(feature)<=100"
                [class.marker-medium]="getValue(feature)<=10000 && getValue(feature)>100"
                [class.marker-big]="getValue(feature)>10000"
                (click)="selectPoint($event, feature)">
                {{ getValue(feature) }}
              </div>
            </ng-template>
            <ng-template mglClusterPoint let-feature>
              <div 
                class="marker"
                [class.marker-small]="getClusterValue(feature)<=100"
                [class.marker-medium]="getClusterValue(feature)<=10000 && getClusterValue(feature)>100"
                [class.marker-big]="getClusterValue(feature)>10000"
                (click)="selectCluster($event, feature)">
                {{ getClusterValue(feature) }}
              </div>
            </ng-template>
          </mgl-marker-cluster>  
          <mgl-popup
            *ngIf="selectedCluster"
            [lngLat]="selectedCluster.lngLat">
            <result-map-cluster-popup
              [supercluster]="supercluster"
              [clusterId]="selectedCluster.id"
              [count]="selectedCluster.count"
              [typeShow]="typeShow">
            </result-map-cluster-popup>
          </mgl-popup> 
          <mgl-popup
            *ngIf="selectedPoint"
            [lngLat]="selectedPoint.lngLat">
            <span>{{ selectedPoint.properties.code }}: {{ getValue(selectedPoint) }} {{ getUnit() }}</span>
          </mgl-popup>
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
                      [0, '#DF01D7'],
                      [0.5, '#0B610B'],
                      [1, '#FF8000']
                    ]
                },
                'fill-opacity': 0.3,
                'fill-outline-color': '#000'
                }">            
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
                      [0, '#FF0000'],
                      [1, '#00FF00'],
                      [10, '#0000FF']
                    ]
                },
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

    ::ng-deep .marker, .marker {    
      border-radius: 50%;
      background-color: #7d7d7d;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    ::ng-deep .marker-small,.marker-small {
      width: 30px;
      height: 30px;
      border: 2px solid #FF0000;
    }
    ::ng-deep .marker-medium {
      width: 35px;
      height: 35px;
      border: 2px solid #00FF00;
    }
    ::ng-deep .marker-big {
      width: 40px;
      height: 40px;
      border: 2px solid #0000FF;
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
  markers: any[] = [];
  zones: any[] = [];
  markers$: Observable<Turf.FeatureCollection>;
  layerZones$: Observable<Turf.FeatureCollection>;
  bounds$: Observable<LngLatBounds>;
  boundsPadding: number = 100;
  zoomMaxMap = 17;
  zoom: number = 9;
  selectedPoint: any;
  supercluster: Supercluster;
  selectedCluster: {
    lngLat: LngLatLike;
    count: number;
    id: number;
  };
  currentBiomValueCluster: number = 0;
  currentAbunValueCluster: number = 0;
  currentTypeCluster: string = "biomass";
  currentZoomCluster: number = 0;
  currentIdCluster: number = 0;

  constructor() {

  }

  zoomChange(event) {
    this.zoom = event.target.getZoom();
  }

  ngOnInit() {
    this.initMarkers();
    this.initZones();
    this.filterFeaturesCollection();
  }

  ngOnChanges(event) {
    this.filterFeaturesCollection();
  }

  initMarkers() {
    if (this.markers.length <= 0) {
      for (let i in this.results.resultPerSurvey) {
        for (let rsp of this.results.resultPerSurvey[i].resultPerSpecies) {
          for (let rt of rsp.resultPerStation) {
            if (rt.densityPerHA >= 0 && rt.biomassPerHA >= 0) {
              let s: Station = this.analyseData.usedStations.filter((station: Station) => station.properties.code === rt.codeStation) && this.analyseData.usedStations.filter(station => station.properties.code === rt.codeStation)[0];
              let marker = {
                geometry: {
                  coordinates: s.geometry.coordinates
                },
                properties: {
                  code: s.properties.code,
                  abundancy: rt.densityPerHA,
                  biomass: rt.biomassPerHA,
                  species: rsp.codeSpecies,
                  survey: this.results.resultPerSurvey[i].codeSurvey
                }
              };
              this.markers.push(marker);
            }
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
            if (rz.densityPerHA >= 0 && rz.biomassPerHA >= 0) {
              let z: Zone = this.analyseData.usedZones.filter((zone: Zone) => zone.properties.code === rz.codeZone) && this.analyseData.usedZones.filter((zone: Zone) => zone.properties.code === rz.codeZone)[0];
              let polygon = {
                geometry: {
                    coordinates: z.geometry.coordinates
                  },
                  properties: {
                    code: z.properties.code,
                    abundancy: rz.densityPerHA,
                    biomass: rz.biomassPerHA,
                    species: rsp.codeSpecies,
                    survey: this.results.resultPerSurvey[i].codeSurvey
                  }
              };
              this.zones.push(polygon);
            }
          }
        }
      }
    }
  }

  filterFeaturesCollection() {
    // stations
    let featureCollection = Turf.featureCollection(
      this.markers
        .filter(marker => marker.properties.species === this.spShow && marker.properties.survey === this.surveyShow )
        .map(marker => Turf.point(marker.geometry.coordinates, { cluster: false, code: marker.properties.code, abundancy: marker.properties.abundancy, biomass: marker.properties.biomass })));
    this.markers$ = of(featureCollection);
    // zones
    let fc2 = Turf.featureCollection(
      this.zones
        .filter(zone => zone.properties.species === this.spShow && zone.properties.survey === this.surveyShow)
        .map(zone => Turf.polygon(zone.geometry.coordinates,{code: zone.properties.code, abundancy: zone.properties.abundancy, biomass: zone.properties.biomass}))
    );
    this.layerZones$ = of(fc2);
    // bounds
    var bnd = new LngLatBounds();
    this.markers.forEach((marker) => bnd.extend(marker.geometry.coordinates));
    this.bounds$ = of(bnd);
  }

  load(event) {
    this.supercluster = event;
  }

  selectPoint(evt: MapMouseEvent, feature: any) {
    event.stopPropagation(); // This is needed, otherwise the popup will close immediately
    this.selectedCluster=null;
    this.selectedPoint = {
      lngLat: [...feature.geometry!.coordinates],
      properties: {
        code: feature.properties.code!,
        biomass: feature.properties.biomass!,
        abundancy: feature.properties.abundancy!
      }
    };
  }

  selectCluster(event: MouseEvent, feature: Cluster) {
    event.stopPropagation(); // This is needed, otherwise the popup will close immediately
    this.selectedPoint=null;
    this.selectedCluster = {
      // Change the ref, to trigger mgl-popup onChanges (when the user click on the same cluster)
      lngLat: [...feature.geometry!.coordinates],
      count: feature.properties.point_count!,
      id: feature.properties.cluster_id!
    };
  }

  getValue(feature) {
    this.currentTypeCluster = this.typeShow;
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

  getClusterValue(feature: Cluster) {
    let value = 0;
    let id = feature.properties.cluster_id!;
    if (this.zoom === this.currentZoomCluster && this.currentIdCluster === id && this.currentTypeCluster === this.typeShow) {
      if (this.typeShow === "A") {
        return this.currentAbunValueCluster;
      } else {
        return this.currentBiomValueCluster;
      }
    }
    try {
      let leaves = this.supercluster.getLeaves(id, Infinity, 0);
      for (let i in leaves) {
        let add = leaves[i].properties[(this.typeShow==="A")?"abundancy":"biomass"];
        value = (value === 0)?value+add:(value+add)/2;
      }
      if (this.typeShow === "A") {
        this.currentAbunValueCluster = Math.round(value);
      } else {
        this.currentBiomValueCluster = Math.round(value);
      }
      this.currentZoomCluster = this.zoom;
      this.currentIdCluster = id;
      return this.currentBiomValueCluster;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }


}
