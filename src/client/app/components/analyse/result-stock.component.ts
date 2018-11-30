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
            <h2>{{'STOCK' | translate}}</h2>        
            <div  class="container">
            <mat-card *ngFor="let sp of results.resultAll">
                <mat-card-title>{{ sp.nameSpecies }}</mat-card-title>
                <mat-card-content *ngIf="sp.resultPerPlatform[0] && sp.resultPerPlatform[0].resultStock">                                       
                    <div>
                        {{ 'TOTAL_IND' | translate }}:<span class="bold"> {{ sp.resultPerPlatform[0].resultStock.density | number:'1.0-0':'fr' }} {{'INDIVIDUALS' | translate}}</span> 
                        &plusmn; {{ sp.resultPerPlatform[0].resultStock.densityCI | number:'1.0-0':'fr' }}  {{'INDIVIDUALS' | translate}}
                    </div>
                    <div>{{ 'CONSERVATIVE_IND' | translate }}: {{ sp.resultPerPlatform[0].resultStock.densityCA | number:'1.0-0':'fr' }}  {{'INDIVIDUALS' | translate}}</div>
                    <div>{{ 'DENSITY_PER_HA' | translate }}: {{ sp.resultPerPlatform[0].resultStock.densityPerHA | number:'1.0-0':'fr' }}  {{'ABUNDANCY_HA_UNIT' | translate}}</div>
                    <div *ngIf="sp.resultPerPlatform[0].resultStock.stock">
                        {{ 'TOTAL_STOCK' | translate }}: <span class="bold">{{ getInTonnes(sp.resultPerPlatform[0].resultStock.stock) | number:'1.0-2':'fr' }} {{'TONS' | translate}} </span>
                        &plusmn;{{ getInTonnes(sp.resultPerPlatform[0].resultStock.stockCI) | number:'1.0-2':'fr' }} {{'TONS' | translate}}
                    </div>
                    <div *ngIf="sp.resultPerPlatform[0].resultStock.stockCA">{{ 'CONSERVATIVE_IND' | translate }}: {{ getInTonnes(sp.resultPerPlatform[0].resultStock.stockCA) | number:'1.0-2':'fr' }}  {{'TONS' | translate}}</div>
                </mat-card-content>
            </mat-card>
            </div>
        </div>
     `,
    styles: [
        `
      .container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
      }
      mat-card {
        width: 500px;
        height: 300px;
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





}