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
        <mgl-marker-cluster
          *ngIf="markers$ | async"
          [data]="markers$ | async"
          [radius]="50"
          (load)="load($event)">
          <ng-template mglPoint let-feature>
            <div
              class="marker marker-small"
              (click)="selectPoint($event, feature)">
              {{ getValue(feature) }}
            </div>
          </ng-template>
          <ng-template mglClusterPoint let-feature>
            <div 
              class="marker"
              [class.marker-small]="getClusterValue(feature)<=100"
              [class.marker-medium]="getClusterValue(feature)<=10000 && getBiomassCluster(feature)>100"
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
            [typeShow}="typeShow">
          </result-map-cluster-popup>
        </mgl-popup> 
        <mgl-popup
          *ngIf="selectedPoint"
          [lngLat]="selectedPoint.geometry?.coordinates">
          <span>{{ selectedPoint.properties?.code }}: {{ getValue(selectedPoint) }}</span>
        </mgl-popup>
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
  markers: any[] = [];
  markers$: Observable<Turf.FeatureCollection>;
  bounds$: Observable<LngLatBounds>;
  boundsPadding: number = 100;
  zoomMaxMap = 17;
  zoom: number = 9;
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
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
    this.filterFeatureCollection();
  }

  ngOnChanges() {
    this.filterFeatureCollection();
  }

  initMarkers() {
    if (this.markers.length <= 0) {
      for (let i in this.results.resultPerSurvey) {
        for (let rsp of this.results.resultPerSurvey[i].resultPerSpecies) {
          for (let rt of rsp.resultPerStation) {
            if (rt.densityPerHA > 0 && rt.biomassPerHA > 0) {
              let t: Station = this.analyseData.usedStations.filter((station: Station) => station.properties.code === rt.codeStation) && this.analyseData.usedStations.filter(station => station.properties.code === rt.codeStation)[0];
              let marker = {
                geometry: {
                  coordinates: t.geometry.coordinates
                },
                properties: {
                  code: t.properties.code,
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

  filterFeatureCollection() {
    let featureCollection = Turf.featureCollection(
      this.markers
        .filter(marker => { console.log(marker); return marker.properties.species === this.spShow && marker.properties.survey === this.surveyShow })
        .map(marker => Turf.point(marker.geometry.coordinates, { cluster: false, code: marker.properties.code, abundancy: marker.properties.abundancy, biomass: marker.properties.biomass })));
    this.markers$ = of(featureCollection);
    var bnd = new LngLatBounds();
    this.markers.forEach((marker) => bnd.extend(marker.geometry.coordinates));
    this.bounds$ = of(bnd);
    //console.log(this.bounds$);
  }

  load(event) {
    this.supercluster = event;
  }

  selectPoint(evt: MapMouseEvent, feature: any) {
    console.log(feature);
    this.selectedPoint = feature;
  }

  selectCluster(event: MouseEvent, feature: Cluster) {
    console.log(feature);
    event.stopPropagation(); // This is needed, otherwise the popup will close immediately
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

  getClusterValue(feature: Cluster) {
    console.log(this.typeShow);
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
        console.log(leaves[i].properties[(this.typeShow==="A")?"abundancy":"biomass"]);
        value = (value + leaves[i].properties[(this.typeShow==="A")?"abundancy":"biomass"]) / 2;
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
      return 0;
    }
  }


}
