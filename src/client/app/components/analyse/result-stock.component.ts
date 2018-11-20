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
        <mat-card class="container">
            <mat-card-title-group>
                <mat-card-title>{{'STOCK' | translate}}</mat-card-title>        
            </mat-card-title-group>
            <mat-card-content *ngFor="let sp of results.resultAll">
                <div *ngIf="sp.resultPerPlatform[0] && sp.resultPerPlatform[0].resultStock">
                    <div>{{ sp.nameSpecies }}</div>
                    <div *ngIf="sp.resultPerPlatform[0].resultStock.stock">{{ 'BIOMASS' | translate }}: {{ sp.resultPerPlatform[0].resultStock.stock }} &plusmn;{{ sp.resultPerPlatform[0].resultStock.stockCI }}</div>
                    <div>{{ 'ABONDANCE' | translate }}: {{ sp.resultPerPlatform[0].resultStock.density }} &plusmn;{{ sp.resultPerPlatform[0].resultStock.densityCI }}</div>
                </div>
            </mat-card-content>
        </mat-card>
     `,
    styles: [
        `
      .host {
          display: flex;
          flex-direction: row;
          justify-content: center;
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

    getResultStock(species) {

    }



}