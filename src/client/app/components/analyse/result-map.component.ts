
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild, EventEmitter, Output } from '@angular/core';

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';
import { Results, Data } from '../../modules/analyse/models/index';

@Component({
  selector: 'bc-result-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="container">
     <map></map>
   </div>
  `,
  styles: [
  `
   map {
      width: 800px;
      height: 500px;
      border: 1px solid black;
    } 
    .container {
      display: flex;
      margin-left: 20px;
      margin-right: 20px;
    }
  `]
})
export class ResultMapComponent implements OnInit/*, AfterViewInit*/ {
  @Input() results: Results;
  @Input() analyseData: Data;
  @Input() typeShow : string;
  @Input() spShow: string;
  @Input() surveyShow: string;

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
  }

  initMarkers(){
    if(this.markers.length <=0 ){
      for(let i in this.results.resultPerSurvey){      
        for(let rsp of this.results.resultPerSurvey[i].resultPerSpecies){     
          for(let rt of rsp.resultPerStation){
            if(rt.densityPerHA>0 && rt.biomassPerHA >0){
              let t: Station = this.analyseData.usedStations.filter((station:Station) => station.properties.code === rt.codeStation) && this.analyseData.usedStations.filter(station => station.properties.code === rt.codeStation)[0];
              let marker = {
                fillColor:this.colors[i],
                latitude:Number(t.geometry.coordinates[1]),
                longitude:Number(t.geometry.coordinates[0]),
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


}
