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
              class="marker">
              {{ feature.properties['biomass'] }}
            </div>
          </ng-template>
          <ng-template mglClusterPoint let-feature>
            <div
              class="marker-cluster"
              (click)="selectCluster($event, feature)">
              {{ feature.properties?.point_count }}
            </div>
          </ng-template>
        </mgl-marker-cluster>   
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
    ::ng-deep .marker-cluster {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #4f615a;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      border: 2px solid #56C498;
      cursor: pointer;
    }

    .marker {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #7d7d7d;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid #C9C9C9
    }
  `]
})
export class ResultMapComponent implements OnInit/*, AfterViewInit*/ {
  @Input() results: Results;
  @Input() analyseData: Data;
  @Input() typeShow : string;
  @Input() spShow: string;
  @Input() surveyShow: string;
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

  mapLat: any = 0;
  mapLng: any = 0;
  mapZoom: any = 0;
  markers: any[] = [];
  colors: string[] = ['blue','green','red','yellow','purple','orange','pink','cyan'];
  iconSize = [
    {
      size:24,
      url:'http://maps.google.com/mapfiles/ms/micons/red.png'
    },{
      size:32,
      url:'http://maps.google.com/mapfiles/ms/micons/orange.png'
    },{
      size:48,
      url:'http://maps.google.com/mapfiles/ms/micons/yellow.png'
    },{
      size:64,
      url:'http://maps.google.com/mapfiles/ms/micons/green.png'
    }];

  constructor() {

  }

  ngOnInit(){
    console.log("init map");
    this.mapLat = this.analyseData.usedCountry.coordinates.lat;
    this.mapLng = this.analyseData.usedCountry.coordinates.lng;
    this.mapZoom = 9;    
    this.initMarkers();
    let featureCollection = Turf.featureCollection(this.markers.map(marker => Turf.point(marker.geometry.coordinates,{code: marker.properties.code,abundancy: marker.properties.abundancy,biomass: marker.properties.biomass})));
    this.markers$ = of(featureCollection);
    var bnd = new LngLatBounds();
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
    event.stopPropagation(); // This is needed, otherwise the popup will close immediately
    this.selectedCluster = {
      // Change the ref, to trigger mgl-popup onChanges (when the user click on the same cluster)
      lngLat: [ ...feature.geometry!.coordinates ],
      count: feature.properties.point_count!,
      id: feature.properties.cluster_id!
    };
  }




}
