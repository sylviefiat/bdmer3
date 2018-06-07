
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';
import { ResultSurvey } from '../../modules/analyse/models/index';
declare var google: any;

@Component({
    selector: 'bc-result-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
  <div class="container">   
     
   </div>
  `,
    styles: [
        `
   
  `]
})
export class ResultChartComponent implements OnInit/*, AfterViewInit*/ {
    @Input() resultSurvey: ResultSurvey;
    @Input() type: string;
    @Input() chartType: string;
    chartData: any;
    title: string;

    constructor() {

    }

    ngOnInit() {
      this.chartData = this.getChartData(this.type);
      console.log(this.type);
    }

    getChartData(type: string){
      return {
                chartType: this.chartType,
                dataTable: [
                    //this.header,
                    ...this.fillData(type)
                ],
                options: { 'legend': 'true', 'title': this.title },
            };
    }

    fillData(type: string): any[] {
        let data: any[] = [];
        data[0] = [];
        this.title = type === 'B' ? 'Biomass' : 'Abundance';
        if (this.chartType === 'CandlestickChart') {
                data[0] = [this.resultSurvey.codeSurvey, this.title, '', '', ''];
            } else if (this.chartType === 'PieChart') {
                data[0] = [this.resultSurvey.codeSurvey, this.title];
            }
        for (let i in this.resultSurvey.resultPerSpecies) {
            let index = Number(i)+1;
            console.log(index);
            data[index] = [];
            let value = type === 'B' ? this.resultSurvey.resultPerSpecies[i].biomassTotal : this.resultSurvey.resultPerSpecies[i].numberIndividual;
            let sd = type === 'B' ? this.resultSurvey.resultPerSpecies[i].SDBiomassTotal : this.resultSurvey.resultPerSpecies[i].SDAbundancyTotal;            
            if (this.chartType === 'CandlestickChart') {
                data[index] = [this.resultSurvey.resultPerSpecies[i].codeSpecies, value - sd, value, value, value + sd];
            } else if (this.chartType === 'PieChart') {
                data[index] = [this.resultSurvey.resultPerSpecies[i].codeSpecies, value];
            }
        }
        console.log(data);
        return data;
    }


}
