import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as Turf from '@turf/turf';
import { MatCheckboxChange } from '@angular/material';
import { IAppState } from '../../modules/ngrx/index';
import { MapService } from '../../modules/core/services/index';
import { Zone, Survey, Species } from '../../modules/datas/models/index';
import { Results, Data, ResultSurvey , ResultStock} from '../../modules/analyse/models/index';

@Component({
    selector: 'bc-result-stock',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div>            
            <mat-card class="large">
              <mat-card-title>{{'STOCK' | translate }}</mat-card-title>
              <mat-card-subtitle>{{'STOCK_STATS' | translate }}</mat-card-subtitle>
              <div>{{ 'NB_SURVEYS' | translate}}: {{ results.resultPerSurvey.length | number:'1.0-0':'fr' }}</div>
              <div>{{ 'PERIOD_COVERED' | translate}}: {{ displayYears() }}</div>
            </mat-card>
            <div  class="container">
            <mat-card *ngFor="let sp of results.resultAll">
                <mat-card-title>{{ sp.nameSpecies }}</mat-card-title>
                <div *ngIf="sp.resultPerPlatform[0] && sp.resultPerPlatform[0].resultStock">
                  <mat-card-subtitle>{{ 'ASSESMENT_REPORT' | translate }}</mat-card-subtitle>
                  <mat-card-content>
                    <div>{{ 'NB_ZONES_RATIO_OK' | translate}}: {{ sp.resultPerPlatform[0].nbZones | number:'1.0-0':'fr' }}</div>
                    <div>{{ 'SURFACE_TOTALE_ZONES' | translate}}: {{ getSurfaceInKm2(sp.resultPerPlatform[0].surface) | number:'1.0-0':'fr' }} {{ 'KM2' | translate }}</div>
                    <div>{{ 'NB_STATIONS' | translate}}: {{ sp.resultPerPlatform[0].nbStations | number:'1.0-0':'fr' }}</div>                
                    <div>{{ 'AVERAGE_STATIONS' | translate}}: {{ getAveStation(sp.resultPerPlatform[0]) | number:'1.0-1':'fr' }}</div>
                    <div>
                        {{ 'TOTAL_IND' | translate }}:<span class="bold"> {{ sp.resultPerPlatform[0].resultStock.density | number:'1.0-0':'fr' }} {{'INDIVIDUALS' | translate}}</span> 
                        &plusmn; {{ sp.resultPerPlatform[0].resultStock.densityCI | number:'1.0-0':'fr' }}  {{'INDIVIDUALS' | translate}}
                    </div>
                    <div>{{ 'CONSERVATIVE_IND' | translate }}: {{ sp.resultPerPlatform[0].resultStock.densityCA | number:'1.0-0':'fr' }}  {{'INDIVIDUALS' | translate}}</div>
                    <div>{{ 'DENSITY_PER_HA' | translate }}: {{ sp.resultPerPlatform[0].resultStock.densityPerHA | number:'1.0-1':'fr' }}  {{'ABUNDANCY_HA_UNIT' | translate}}</div>
                    <div>{{ 'DENSITYCA_PER_HA' | translate }}: {{ sp.resultPerPlatform[0].resultStock.densityCAPerHA | number:'1.0-1':'fr' }}  {{'ABUNDANCY_HA_UNIT' | translate}}</div>
                    <div *ngIf="sp.resultPerPlatform[0].resultStock.stock">
                        {{ 'TOTAL_STOCK' | translate }}: <span class="bold">{{ getInTonnes(sp.resultPerPlatform[0].resultStock.stock) | number:'1.0-2':'fr' }} {{'TONS' | translate}} </span>
                        &plusmn;{{ getInTonnes(sp.resultPerPlatform[0].resultStock.stockCI) | number:'1.0-2':'fr' }} {{'TONS' | translate}}
                    </div>
                    <div *ngIf="sp.resultPerPlatform[0].resultStock.stockCA">{{ 'CONSERVATIVE_IND' | translate }}: {{ getInTonnes(sp.resultPerPlatform[0].resultStock.stockCA) | number:'1.0-2':'fr' }}  {{'TONS' | translate}}</div>
                  </mat-card-content>
                  <mat-card-subtitle>{{ 'FISHER_CATCHES_REPORT' | translate }}</mat-card-subtitle>
                  <mat-card-content>
                    <div>{{ 'VESSELS_NAMES' | translate}}: {{ getVesselsNames() }}</div>
                    <div>{{ 'NB_TRIPS' | translate}}: {{ results.resultPerSurvey.length | number:'1.0-0':'fr' }}</div>
                    <div>{{ 'NB_DIVES' | translate}}: {{ sp.resultPerPlatform[0].nbStationsTotal | number:'1.0-0':'fr' }}</div>
                    <div>{{ 'NB_CATCHES' | translate}}: {{ sp.resultPerPlatform[0].nbCatches | number:'1.0-0':'fr' }}</div>
                  </mat-card-content>
                </div>
            </mat-card>
            </div>
        </div>
     `,
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
        height: 350px;
        margin: 15px;
      }
      .bold {
          font-weight: bold;
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
      for(let platform of this.analyseData.usedPlatforms){
        vn = (vn.length >0 ? vn+", ":"") + platform.code;
      }
      return vn;
    }

    getSurfaceInKm2(surface){
      return Number(surface)/1000000;
    }

    getAveStation(Resultplatform) {
      return Resultplatform.nbStations / (Number(Resultplatform.surface)/1000000);
    }

}