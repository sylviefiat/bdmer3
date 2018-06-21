import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LngLatBounds, LngLatLike } from 'mapbox-gl';
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
        }"> 
        <mgl-marker-cluster
          *ngIf="markers$ | async"
          [data]="markers$ | async"
          [maxZoom]="14"
          [radius]="50"
          (load)="supercluster = $event">
          <ng-template mglPoint let-feature>
            <div
              class="marker marker-small">
              {{'BIOMASS' | translate}}: {{ feature.properties['biomass'] }}
            </div>
          </ng-template>
          <ng-template mglClusterPoint let-feature>
            <div 
              class="marker"
              [class.marker-small]="getBiomassCluster(feature)<=100"
              [class.marker-medium]="getBiomassCluster(feature)<=10000 && getBiomassCluster(feature)>100"
              [class.marker-big]="getBiomassCluster(feature)>10000"
              (click)="selectCluster($event, feature)">
              {{ getBiomassCluster(feature) }}
            </div>
          </ng-template>
        </mgl-marker-cluster>  
        <mgl-popup
          *ngIf="selectedCluster"
          [lngLat]="selectedCluster.lngLat">
          <result-map-cluster-popup
            [supercluster]="supercluster"
            [clusterId]="selectedCluster.id"
            [count]="selectedCluster.count">
          </result-map-cluster-popup>
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
export class ResultMapComponent implements OnInit/*, AfterViewInit*/ {
  @Input() results: Results;
  @Input() analyseData: Data;
  @Input() typeShow : string;
  @Input() spShow: string;
  @Input() surveyShow: string;
  markers: any[] = [];
  markers$: Observable<Turf.FeatureCollection>;
  bounds$: Observable<LngLatBounds>;
  boundsPadding: number = 100;
  zoomMaxMap=11;
  supercluster: Supercluster;
  selectedCluster: {
    lngLat: LngLatLike;
    count: number;
    id: number;
  };

  constructor() {

  }

  ngOnInit(){  
    this.initMarkers();
    let featureCollection = Turf.featureCollection(this.markers.map(marker => Turf.point(marker.geometry.coordinates,{code: marker.properties.code,abundancy: marker.properties.abundancy,biomass: marker.properties.biomass})));
    this.markers$ = of(featureCollection);
    var bnd = new LngLatBounds();
    console.log(bnd);
    this.markers.forEach((marker) => bnd.extend(marker.geometry.coordinates));
    this.bounds$=of(bnd);
  }

  initMarkers(){
    if(this.markers.length <=0 ){
      for(let i in this.results.resultPerSurvey){      
        for(let rsp of this.results.resultPerSurvey[i].resultPerSpecies){     
          for(let rt of rsp.resultPerStation){
            if(rt.densityPerHA>0 && rt.biomassPerHA >0){
              let t: Station = this.analyseData.usedStations.filter((station:Station) => station.properties.code === rt.codeStation) && this.analyseData.usedStations.filter(station => station.properties.code === rt.codeStation)[0];
              let marker = {
                geometry: {
                  coordinates:t.geometry.coordinates
                },
                properties: {
                  code: t.properties.code,
                  abundancy:rt.densityPerHA,
                  biomass:rt.biomassPerHA,
                  species:rsp.codeSpecies,
                  survey:this.results.resultPerSurvey[i].codeSurvey
                }
              };
              this.markers.push(marker);
            }
          }
        }
      }
    }  
  }

  selectCluster(event: MouseEvent, feature: Cluster) {
    console.log(feature);
    //console.log((<any>this.supercluster.getLeaves)(feature.properties.cluster_id!, 230, 0));
    event.stopPropagation(); // This is needed, otherwise the popup will close immediately
    this.selectedCluster = {
      // Change the ref, to trigger mgl-popup onChanges (when the user click on the same cluster)
      lngLat: [ ...feature.geometry!.coordinates ],
      count: feature.properties.point_count!,
      id: feature.properties.cluster_id!
    };
  }

  getAbundancyCluster(feature: Cluster){
    let abund = 0;
    let id= feature.properties.cluster_id!;
    let leaves = (<any>this.supercluster.getLeaves)(id, 5, 0);
    for(let i in leaves){
      //console.log(leaves[i]);
      abund+=leaves[i].properties.abundancy;
    }
    return Math.round(abund);
  }

  getBiomassCluster(feature: Cluster){
    let biom = 0;
    let id= feature.properties.cluster_id!;
    let leaves = (<any>this.supercluster.getLeaves)(id, Infinity, 0);
    for(let i in leaves){
        //console.log(leaves[i]);
      biom+=leaves[i].properties.biomass;
    }
    return Math.round(biom);
  }


}
