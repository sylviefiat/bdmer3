
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral } from '@agm/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Transect } from '../../modules/datas/models/index';
import { Results, Data } from '../../modules/analyse/models/index';
declare var google: any;

@Component({
  selector: 'bc-result-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="container">
     <agm-map #AgmMap [latitude]="mapLat" [longitude]="mapLng" [zoom]="mapZoom">
                  
        <agm-circle #AgmMap *ngFor="let marker of (markersAbundancy)" [class.show]="showAbundancy$ | async" [class.hide]="!showAbundancy$ | async"
            [latitude]="marker.latitude" 
            [longitude]="marker.longitude" 
            [radius]="(marker.species===(spShow$ | async)&&marker.survey===(surveyShow$ |async)?marker.radius:0"
            [fillColor]="marker.fillColor">
        </agm-circle>
        <agm-circle #AgmMap *ngFor="let marker of (markersBiomass)" [class.show]="showBiomass" [class.hide]="!showBiomass"
            [latitude]="marker.latitude" 
            [longitude]="marker.longitude" 
            [radius]="(marker.species===(spShow$ | async)&&marker.survey===(surveyShow$ |async)?marker.radius:0"
            [fillColor]="marker.fillColor">
        </agm-circle>
     </agm-map>
     <div class="legend">
        <mat-radio-group (change)="changeDisplay($event)">
          <mat-radio-button value="0">Show Biomass</mat-radio-button>
          <mat-radio-button value="1">Show abundancy</mat-radio-button>
        </mat-radio-group>
        <mat-radio-group (change)="setShowSp($event)">
          <mat-radio-button *ngFor="let sp of data.usedSpecies" value="sp.code">{{sp.scientificName}}</mat-radio-button>
        </mat-radio-group>
        <mat-radio-group (change)="setShowSurvey($event)">
          <mat-radio-button *ngFor="let sv of data.usedSurveys" value="sv.code">{{sv.code}}</mat-radio-button>
        </mat-radio-group>
      </div>
   </div>
  `,
  styles: [
  `
   agm-map {
      width: 800px;
      height: 500px;
    } 
    .legend {
      width: 300px;
      height: 500px;
    }
    .show {
      display: block;
    }
    .hide {
      display: none;
    }
  `]
})
export class ResultMapComponent implements OnInit/*, AfterViewInit*/ {
  @Input() results: Results;
  @Input() data: Data;
  @ViewChild('AgmMap') agmMap: AgmMap;
  mapLat: any = 0;
  mapLng: any = 0;
  mapZoom: any = 0;
  markersAbundancy: any[] = [];
  markersBiomass: any[] = [];
  colors: string[] = ['blue','green','red','yellow','purple','orange','pink','cyan'];
  showBiomass$ : Observable<boolean> = of(true);
  showAbundancy$ : Observable<boolean> = of(false);
  spShow$: Observable<string>;
  surveyShow$: Observable<string>;

  constructor(googleMapsAPIWrapper: GoogleMapsAPIWrapper) {

  }

  ngOnInit(){
    this.mapLat = this.data.usedCountry.coordinates.lat;
    this.mapLng = this.data.usedCountry.coordinates.lng;
    this.mapZoom = 9;    
    this.initMarkers();
  }

  /*ngAfterViewInit() {
    this.agmMap.mapReady.subscribe(map => {
        map.setCenter({lat: this.data.usedCountry.coordinates.lat, lng: this.data.usedCountry.coordinates.lng})
      });
  }*/

  initMarkers(){
    for(let i in this.results.resultPerSurvey){
      let marker = {fillColor:this.colors[i],latitude:0,longitude:0,radius:0,species:"",survey:this.results.resultPerSurvey[i].codeSurvey};
      if(this.surveyShow$ === null) this.setShowSurvey(marker.survey);
      for(let rsp of this.results.resultPerSurvey[i].resultPerSpecies){        
        marker.species=rsp.codeSpecies;
        if(this.spShow$ === null) this.setShowSp(marker.species);
        for(let rt of rsp.resultPerTransect){
          let t: Transect = this.data.usedTransects.filter((transect:Transect) => transect.code === rt.codeTransect) && this.data.usedTransects.filter(transect => transect.code === rt.codeTransect)[0];
          marker.longitude = Number(t.longitude);
          marker.latitude = Number(t.latitude);
          marker.radius = rt.density>1?rt.density*1000:1000;
          this.markersAbundancy.push(marker);
          console.log(marker);
          marker.radius = rt.biomassPerSquareMeter>100?rt.biomassPerSquareMeter*100:1000;
          this.markersBiomass.push(marker);
        }
      }
    }
    
  }

  changeDisplay(showAbundancy: number){
    console.log(showAbundancy);
    this.showAbundancy$ = of(showAbundancy?true:false);
    this.showBiomass$ = of(showAbundancy?false:true);
  }

  setShowSp(spCode: string){
    console.log(spCode);
    this.spShow$=of(spCode);
  }

  setShowSurvey(svCode: string){
    console.log(svCode);
    this.surveyShow$=of(svCode);
  }


}
