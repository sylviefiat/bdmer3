
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Transect } from '../../modules/datas/models/index';
import { Results, Data } from '../../modules/analyse/models/index';
declare var google: any;

@Component({
    selector: 'bc-result-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
  <div class="container">
     <google-chart [data]="candleStickChartData"></google-chart>
   </div>
  `,
    styles: [
        `
   
  `]
})
export class ResultChartComponent implements OnInit/*, AfterViewInit*/ {
    @Input() results: Results;
    @Input() analyseData: Data;
    candleStickChartData: any;

    constructor() {

    }

    ngOnInit() {
        this.candleStickChartData = {
            chartType: 'CandlestickChart',
            dataTable: [
              ['Day','IL','VL','VH','IH'],
              ['Mon', 20, 28, 38, 45],
              ['Tue', 31, 38, 55, 66],
              ['Wed', 50, 55, 77, 80],
              ['Thu', 77, 77, 66, 50],
              ['Fri', 68, 66, 22, 15]
              // Treat first row as data as well.
            ],
            options: { 'legend': 'none' },
        };
    }


}
