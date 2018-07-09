
import { Component, OnInit, OnChanges, ChangeDetectionStrategy, Input, Output, ViewChild } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';
import { ChartsStation } from '../../modules/analyse/models/index';

@Component({
    selector: 'bc-result-boxplot',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
  <div class="container"> 
      <div *ngIf="loading">Plot is loading</div>
      <highcharts-chart  *ngIf="!loading"
          [Highcharts]="Highcharts"
          [options]="chartOptions"
          style="width: 100%; height: 400px; display: block;">
      </highcharts-chart>
   </div>
  `,
    styles: [
        `
   
  `]
})
export class ResultBoxplotComponent implements OnInit, OnChanges {
    @Input() type: string;
    @Input() years: string[];
    @Input() chartsData: ChartsStation;
    Highcharts = Highcharts;
    chartOptions: any;
    title: string;
    loading: boolean = false;

    constructor(private translate: TranslateService) {

    }

    ngOnInit() {
        this.loading=true;
        this.getChartOptions();
        this.loading=false;
    }

    ngOnChanges(event) {
        
        if(event.type !== null && event.type.previousValue !== undefined){
            console.log(event);
            this.getChartOptions();
        }
    }

    getChartOptions() {
        this.chartOptions = {
            chart: {
                type: 'boxplot'
            },

            title: {
                text: this.translate.instant('STATION')+" " + this.chartsData.code + " <i>(" + this.translate.instant((this.type === 'B') ? 'BIOMASS' : 'ABUNDANCY')+")</i>"
            },
            legend: {
                enabled: true
            },

            xAxis: {
                categories: this.years,
                title: {
                    text: this.translate.instant('YEARS')
                }
            },
            yAxis: {
                title: {
                    text: this.translate.instant(this.type === 'B' ? 'BIOMASS' : 'ABUNDANCY')+" <i>("+this.translate.instant(this.type === 'B' ? 'BIOMASS_UNIT' : 'ABUNDANCY_UNIT')+")</i>"
                }
            },
            series: this.getSeries()
        };
    }

    /*fillData(codeSp: string): any {
        let dataSpline: any[] = [];
        let dataError: any[] = [];
        let dataPie: number;
        for (let rs of this.resultSurveys.filter(rs => rs.codePlatform === this.station.codePlatform)) {
            let currentYear = rs.yearSurvey;
            let currentIndex = this.years.indexOf(currentYear.toString());
            let rspa = rs.resultPerSpecies.filter(rps => rps.codeSpecies === codeSp);
            if ((rspa !== null || rspa.length > 0) &&
                (rspa[0].resultPerStation
                    .filter(r => r.codeStation === this.station.properties.code) !== null && rspa[0].resultPerStation
                    .filter(r => r.codeStation === this.station.properties.code).length > 0)) {
                        let rst = rspa[0].resultPerStation.filter(r => r.codeStation === this.station.properties.code)[0];
                        let value = this.type === 'B' ? rst.biomassTotal : rst.numberIndividual;
                        let sd = this.type === 'B' ? rst.SDBiomassTotal : rst.SDDensityTotal;
                        dataSpline[currentIndex] = value;
                        dataError[currentIndex] = [value - sd, value + sd];
                        dataPie = rst.numberIndividual;
            } else {
                dataSpline[currentIndex] = 0;
                dataError[currentIndex] = [0, 0];
                dataPie = 0;
            }
        }
        return { dataSpline, dataError, dataPie };
    }*/

    getSeries() {
        let series: any[] = [];
        let pie, piedata: any[]=[];
        let index = 0;
        let unit = this.translate.instant(this.type === 'B' ? 'BIOMASS_UNIT' : 'ABUNDANCY_UNIT');

        for (let i in this.chartsData.species) {
            series[index++] = {
                name: this.chartsData.species[i].scientificName,
                type: 'spline',
                yAxis: 0,
                data: this.chartsData.dataSpline[i],
                tooltip: {
                    headerFormat: '<em>' + unit + '</em><br/>',
                    pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} '+unit+'</b>'
                }
            }
            series[index++] = {
                name: this.chartsData.species[i].scientificName,
                type: 'errorbar',
                yAxis: 0,
                data: this.chartsData.dataError[i],
                tooltip: {
                    headerFormat: '<em>' + (this.type === 'B' ? "Kg/ha" : "ind./ha") + '</em><br/>',
                    pointFormat: '(standard deviation: {point.low}-{point.high} '+unit+'</b>'
                }
            }
            piedata[i] = {
                name: this.chartsData.species[i].scientificName,
                y: this.chartsData.dataPie[i],
                color: Highcharts.getOptions().colors[i]
            }
        }
        pie = {
            type: 'pie',
            name:  this.translate.instant('PIE_LEGEND'),
            data: piedata,
            center: [60, 60],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }
        series.push(pie);
        return series;
    }


}
