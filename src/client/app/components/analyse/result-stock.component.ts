import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as Turf from '@turf/turf';
import { MatCheckboxChange } from '@angular/material';
import { IAppState } from '../../modules/ngrx/index';
import { MapService } from '../../modules/core/services/index';
import { Zone, Survey, Species } from '../../modules/datas/models/index';
import { Results, Data, ResultSurvey } from '../../modules/analyse/models/index';

@Component({
    selector: 'bc-result-stock',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
     `,
    styles: [
        `
      
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

}