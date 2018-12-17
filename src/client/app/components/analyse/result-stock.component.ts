import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as Turf from '@turf/turf';
import { MatCheckboxChange } from '@angular/material';
import { IAppState } from '../../modules/ngrx/index';
import { MapService } from '../../modules/core/services/index';
import { Zone, Survey, Species } from '../../modules/datas/models/index';
import { Results, Data, ResultSurvey , ResultStock} from '../../modules/analyse/models/index';

@Component({
    moduleId: module.id,
    selector: 'bc-result-stock',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'result-stock.component.html',
    styles: [
        `
      .large {
        margin: 0 72px;
        display: flex;
        flex-direction: column;
        align-items:center;
        height:auto;
        justify-content: center;
        width: calc(100% - 144px);
      }
      .container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
      }
      mat-card {
        width: 500px;
        margin: 15px;
      }
      .bold {
          font-weight: bold;
      }
      .italic {
        font-style: italic;
        padding-bottom: 5px;
      }
      .table {
        display:flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content:space-evenly;
      }
      .three div { 
        width: 30%;
      }
      .two div { 
        width: 50%;
      }
  `]
})
export class ResultStockComponent implements OnInit {
    @Input() results: Results;
    @Input() analyseData: Data;
    @Input() showBiom: boolean;

    constructor() {

    }

    ngOnInit() {
    }

    getInTonnes(kg: number){
        if(!kg){
            return 0;
        }
        return kg / 1000;
    }

    displayYears(){
      let dy: string = "";
      let years: string = "";
      let dateStart: Date;
      let dateEnd: Date;      
      for(let y of this.analyseData.usedYears){
        dy = dy === "" ? y.year : ", " + y.year;
        dateStart = dateStart ? (dateStart === y.dateStart ? dateStart : null) : y.dateStart;
        dateEnd = dateEnd ? (dateEnd === y.dateEnd ? dateEnd : null) : y.dateEnd;
      }
      if(!dateStart || !dateEnd){
        return dy;
      }
      return dy + " - "+dateStart+ "/" + dateEnd;
    }

    getVesselsNames(){
      let vn = "";
      for(let rsurvey of this.results.resultPerSurvey){
        vn = (vn.length >0 ? vn+", ":"") + rsurvey.codePlatform;
      }
      return vn;
    }

    getSurfaceInKm2(surface){
      return Number(surface)/1000000;
    }

    getAveStation(Resultplatform,type) {
      switch (type) {
        case "total":
          return Resultplatform.nbStationsTotal / (Number(Resultplatform.surfaceTotal)/1000000);
        case "included":
        default:
          return Resultplatform.nbStations / (Number(Resultplatform.surface)/1000000);
      }
      
    }

}