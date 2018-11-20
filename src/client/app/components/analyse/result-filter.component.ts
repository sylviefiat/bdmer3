
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild, EventEmitter, Output } from '@angular/core';

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';

@Component({
  moduleId: module.id,
  selector: 'bc-result-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'result-filter.component.html',
  styles: [
  `
    mat-card {
      display:flex;
      flex-direction:column;
    }
    .mat-card-subtitle {
      display: inline !important;
      margin-right: 10px;
    }
    .mat-checkbox {
      padding-right: 10px;
    }
    .note {
      color: grey;
      font-style: italic; 
      font-size: smaller;
    }
    .legend {
      display:flex;
      flex-direction:row;
      justify-content: space-around;
    }
    .stationLegend, .zoneLegend {
      display:flex;
      flex-direction:column;
    }
    .legend-key {
      display: inline-block;
      border-radius: 20%;
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
    .legend-circle {
      display: inline-block;
      border-radius: 50%;
      border: solid 1px black;
      background-color: white;
      margin-right: 5px;
    }
  `]
})
export class ResultFilterComponent implements OnInit/*, AfterViewInit*/ {
  @Input() species: Species[];
  @Input() surveys: Survey[];
  @Input() showBiom: boolean;
  @Input() typeShow : string;
  @Input() spShow: string;
  @Input() surveyShow: string;
  @Input() showStations: boolean;
  @Input() showZones: boolean;
  @Output() typeShowEmitter= new EventEmitter<string>();
  @Output() spShowEmitter = new EventEmitter<string>();
  @Output() surveyShowEmitter = new EventEmitter<string>();
  @Output() showStationsEmitter = new EventEmitter<string>();
  @Output() showZonesEmitter = new EventEmitter<string>();
  legend = [{value:'0-1',color:'#FFEDA0',size:4}, {value:'1-10',color:'#FED976',size:6}, 
    {value:'10-20',color:'#FEB24C',size:8},{value:'20-30',color:'#FD8D3C',size:10}, 
    {value:'30-40',color:'#FC4E2A',size:12}, {value:'40-50',color:'#E31A1C',size:14}, 
    {value:'50-100',color:'#BD0026',size:16}, {value:'100+',color:'#800026',size:18}];
  units = ['kg/ha', 'ind./ha'];

  constructor() {

  }

  ngOnInit(){  
    this.surveys = this.surveys.sort((s1,s2)=>s1.code >= s2.code ? Number(1):Number(-1));
  }

  setShowSp(spCode: any){
    this.spShow = spCode.value;
    this.spShowEmitter.emit(this.spShow);
  }

  setShowSurvey(svCode: any){
    this.surveyShow = svCode.value;
    this.surveyShowEmitter.emit(this.surveyShow);
  }

  getUnit(){
    return this.units[this.typeShow==='B'?0:1];
  }


}
