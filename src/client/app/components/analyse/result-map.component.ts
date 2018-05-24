
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

        <agm-marker 
            *ngFor="let marker of markers; let i = index"
            [latitude]="marker.latitude"
            [longitude]="marker.longitude"
            [visible]="display(marker)"
            [iconUrl]="getIcon(marker)">
            
          <agm-info-window>
            <strong>{{getLabel(marker)}}</strong>
          </agm-info-window>
          
        </agm-marker>

     </agm-map>
     <div class="legend">
        <h3>{{'FILTER' | translate}}</h3>
        <h4>{{'TYPE' | translate}}</h4>
        <mat-radio-group (change)="changeDisplay($event)">
          <mat-radio-button value="B" [checked]="typeShow==='B'">{{'DISPLAY_BIOMASS' | translate}}</mat-radio-button>
          <mat-radio-button value="A" [checked]="typeShow==='A'">{{'DISPLAY_ABUNDANCE' | translate}}</mat-radio-button>
        </mat-radio-group>
        <h4>{{'SPECIES' | translate}}</h4>
        <mat-radio-group (change)="setShowSp($event)">
          <mat-radio-button *ngFor="let sp of analyseData.usedSpecies" value="{{sp.code}}" [checked]="spShow===sp.code">{{sp.scientificName}}</mat-radio-button>
        </mat-radio-group>
        <h4>{{'SURVEYS' | translate}}</h4>
        <mat-radio-group (change)="setShowSurvey($event)">
          <mat-radio-button *ngFor="let sv of analyseData.usedSurveys" value="{{sv.code}}" [checked]="surveyShow===sv.code">{{sv.code}}</mat-radio-button>
        </mat-radio-group>
      </div>
   </div>
  `,
  styles: [
  `
   agm-map {
      width: 800px;
      height: 500px;
      border: 1px solid black;
    } 
    .container {
      display: flex;
      margin-left: 20px;
      margin-right: 20px;
    }
    .legend {
      margin-left: 10px;
      border: 1px solid black;
    }
    mat-radio-group{
      display: flex;
      flex-direction: column;
    }
  `]
})
export class ResultMapComponent implements OnInit/*, AfterViewInit*/ {
  @Input() results: Results;
  @Input() analyseData: Data;
  @ViewChild('AgmMap') agmMap: AgmMap;
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
    }]
  typeShow : string = 'B';
  spShow: string;
  surveyShow: string;

  constructor(googleMapsAPIWrapper: GoogleMapsAPIWrapper) {

  }

  ngOnInit(){
    this.mapLat = this.analyseData.usedCountry.coordinates.lat;
    this.mapLng = this.analyseData.usedCountry.coordinates.lng;
    this.mapZoom = 9;    
    this.initMarkers();
  }

  initMarkers(){
    if(this.markers.length <=0 ){
      for(let i in this.results.resultPerSurvey){
        
        if(this.surveyShow === undefined) 
          this.surveyShow=this.results.resultPerSurvey[i].codeSurvey;

        for(let rsp of this.results.resultPerSurvey[i].resultPerSpecies){                  
          if(this.spShow === undefined) 
            this.spShow=rsp.codeSpecies;

          for(let rt of rsp.resultPerTransect){
            if(rt.densityPerHA>0 && rt.biomassPerHA >0){
              let t: Transect = this.analyseData.usedTransects.filter((transect:Transect) => transect.code === rt.codeTransect) && this.analyseData.usedTransects.filter(transect => transect.code === rt.codeTransect)[0];
              let marker = {
                fillColor:this.colors[i],
                latitude:Number(t.latitude),
                longitude:Number(t.longitude),
                abundancy:rt.densityPerHA,
                biomass:rt.biomassPerHA,
                species:rsp.codeSpecies,
                survey:this.results.resultPerSurvey[i].codeSurvey
              };
              this.markers.push(marker);
            }
          }
        }
      }
    }    
  }

  getSizeIconAbundance(j){
    let i=0;
    if(j <= 50) i=0;
    if(j > 50 && j <= 100) i=1;
    if(j > 100 && j <= 1000) i=2;
    if(j > 1000) i=3;
    return i
  }

  getSizeIconBiomass(j){
    let i=0;
    if(j <= 1000) i=0;
    if(j > 1000 && j <= 5000) i=1;
    if(j > 5000 && j <= 10000) i=2;
    if(j > 10000) i=3;
    return i
  }

  getIcon(marker){
    let factor = this.typeShow==='A'?marker.abundancy:marker.biomass;    
    let indice = this.typeShow==='A'?1000:1;    
    let j=factor*indice;
    let i = this.typeShow==='A'?this.getSizeIconAbundance(j):this.getSizeIconBiomass(j);
    let icon =  {
              url: this.iconSize[i].url,
              scaledSize: {
                width: this.iconSize[i].size,
                height: this.iconSize[i].size
              }
            };
    return icon;
  }

  display(marker){
    return marker.species===this.spShow&&marker.survey===this.surveyShow;
  }

  getLabel(marker){
    return this.typeShow==='A'?'Abondance par hectare: '+marker.abundancy:'Biomasse par hectare: '+marker.biomass;
  }

  changeDisplay(showAbundancy: any){
    this.typeShow = showAbundancy.value;
  }

  setShowSp(spCode: any){
    this.spShow=spCode.value;
  }

  setShowSurvey(svCode: any){
    this.surveyShow=svCode.value;
  }


}
