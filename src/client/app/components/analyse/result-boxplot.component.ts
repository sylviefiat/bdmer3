
import { Component, OnInit, OnChanges, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource }  from '@angular/material';

import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';
import { Results } from '../../modules/analyse/models/index';

@Component({
    selector: 'bc-result-boxplot',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
  <div class="container"> 
      <div *ngIf="loading">Plot is loading</div>
      <highcharts-chart  *ngIf="!loading"
          [Highcharts]="Highcharts"
          [options]="chartOptions"
          style="height: 400px; display: block;">
      </highcharts-chart>
      
   </div>
  `,
    styles: [
        `
   .container {
       display:flex;
       justify-content: space-around;
       align-items: center;
   }
   .table {
       background-color: white;
       border: 1px solid grey;
   }
   .row {
       border-bottom: 1px solid grey;
   }
   .column {
       border-right: 1px solid grey;
   }
   .bold {
       font-weight: bold;
   }
  `]
})
export class ResultBoxplotComponent implements OnInit, OnChanges {
    @Input() type: string;
    @Input() chartsData: Results;
    Highcharts = Highcharts;
    chartOptions: any;
    title: string;
    loading: boolean = false;
    series: any[] = [];
    headerRow: any = [];
    table: any = [];
    displayedColumns: any[] = [];
    dataSource: any;

    constructor(private translate: TranslateService) {

    }

    getElement(mot,i){
        return mot["\""+i+"\""];
    }

    ngOnInit() {
        this.loading = true;
        this.getChartOptions();
        //this.setTable();
        this.loading = false;
    }

    ngOnChanges(event) {

        if (event.type !== null && event.type.previousValue !== undefined) {
            this.getChartOptions();
            //this.setTable();
        }
    }

    getChartOptions() {
        
        this.series = this.getSeries();
        this.chartOptions = {
            chart: {
                type: 'boxplot'
            },

            title: {
                text: this.translate.instant('RESULTS_PLATFORMS') + " <i>(" + this.translate.instant((this.type === 'B') ? 'BIOMASS' : 'ABUNDANCY') + ")</i>"
            },
            legend: {
                enabled: true
            },

            xAxis: {
                categories: this.chartsData.resultPerSurvey.map(rps => rps.codeSurvey),
                title: {
                    text: this.translate.instant('SURVEYS')
                }
            },
            yAxis: {
                title: {
                    text: this.translate.instant(this.type === 'B' ? 'BIOMASS' : 'ABUNDANCY') + " <i>(" + this.translate.instant(this.type === 'B' ? 'BIOMASS_UNIT' : 'ABUNDANCY_UNIT') + ")</i>"
                }
            },
            series: this.series
        };
    }

    getSeries() {
        let series: any[] = [];
        let pie, piedata: any[] = [];
        let index = 0;
        let unit = this.translate.instant(this.type === 'B' ? 'BIOMASS_UNIT' : 'ABUNDANCY_UNIT');
        for(let rps of this.chartsData.resultPerSurvey){
            for (let i in rps.resultPerSpecies) {
                series[index++] = {
                    name: rps.codePlatform+" / "+rps.resultPerSpecies[i].codeSpecies,
                    type: 'spline',
                    yAxis: 0,
                    data: this.type === 'B' ? rps.resultPerSpecies[i].resultPerPlatform.map(rpp=>rpp.averageBiomass) : rps.resultPerSpecies[i].resultPerPlatform.map(rpp=>rpp.averageAbundance),
                    tooltip: {
                        headerFormat: '<em>' + unit + '</em><br/>',
                        pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} ' + unit + '</b>'
                    }
                }
                /*series[index++] = {
                    name: rps.resultPerSpecies[i].codeSpecies,
                    type: 'errorbar',
                    yAxis: 0,
                    data: this.type === 'B' ? rps.resultPerSpecies[i].resultPerPlatform.map(rpp=>rpp.averageBiomass) : rps.resultPerSpecies[i].resultPerPlatform.map(rpp=>rpp.averageAbundance),
                    tooltip: {
                        headerFormat: '<em>' + (this.type === 'B' ? "Kg/ha" : "ind./ha") + '</em><br/>',
                        pointFormat: '(standard deviation: {point.low}-{point.high} ' + unit + '</b>'
                    }
                }*/
            }
        }
        return series;
    }

    /*setTable(){
        let table = [];
        let valueSuffix = this.type === 'B' ? "Kg/ha" : "ind./ha";
        // set categories
        table[0] = [];
        table[0][0] = "Years";
        this.years.forEach((year,x) => {
            table[x+1] = [];
            table[x+1][0]=year;
        });
        // set series
        this.series.forEach((serie,i) => {
            if(serie.type != "pie"){
                let complement = serie.type === 'errorbar'?" (standard deviation)":"";
                // series name on first row
                table[0][i+1] = serie.name + complement;
                // data
                serie.data.forEach((data,j) => {
                    let value;
                    if(data instanceof Array){
                        if(data[0]===null){
                            value = "n/a";
                        } else {
                            value = Number(data[0]).toFixed(2)+", "+Number(data[1]).toFixed(2);
                        }
                    } else {
                        if(data === null){
                           value = "n/a";
                        } else {
                            value = Number(data).toFixed(2);
                        }
                    }
                    table[j+1][i+1] = value;
                })
            }
        });
        this.headerRow = table[0];
        this.table = table;
        for(let i =1 ; i < table.length; i++){
            let row = {};
            for(let j in table[i]){
                row["\""+this.headerRow[j]+"\""]=table[i][j];
            }
            this.displayedColumns.push(row);
        }
        this.dataSource = new MatTableDataSource(this.displayedColumns);
    }*/

   


}
