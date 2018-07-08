
import { Component, OnInit, OnChanges, ChangeDetectionStrategy, Input, Output, ViewChild } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);

import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Station } from '../../modules/datas/models/index';
import { ResultSurvey, ResultSpecies } from '../../modules/analyse/models/index';

@Component({
    selector: 'bc-result-boxplot',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
  <div class="container"> 
      <highcharts-chart 
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
    @Input() station: Station;
    @Input() resultSurveys: ResultSurvey[];
    @Input() usedSurveys: Survey[];
    @Input() type: string;
    @Input() years: string[];
    @Input() species: Species[];
    Highcharts = Highcharts;
    chartOptions: any;
    title: string;

    constructor(private translate: TranslateService) {

    }

    ngOnInit() {
        this.getChartOptions();
    }

    ngOnChanges(event) {
        this.getChartOptions();
    }

    getChartOptions() {
        this.chartOptions = {
            chart: {
                type: 'boxplot'
            },

            title: {
                text: this.translate.instant('STATION')+" " + this.station.properties.code + " <i>(" + this.translate.instant((this.type === 'B') ? 'BIOMASS' : 'ABUNDANCY')+")</i>"
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

    fillData(codeSp: string): any {
        let dataSpline: any[] = [];
        let dataError: any[] = [];
        let dataPie: number;
        for (let i in this.resultSurveys) {
            let rs = this.resultSurveys[i];
            let currentYear = new Date(this.usedSurveys.filter(s => rs.codeSurvey === s.code)[0].dateStart).getFullYear();
            let currentIndex = this.years.indexOf(currentYear.toString());
            let rspa = rs.resultPerSpecies.filter(rps => rps.codeSpecies === codeSp);
            if ((rspa !== null || rspa.length > 0) &&
                (rspa[0].resultPerStation.filter(r => r.codeStation === this.station.properties.code) !== null && rspa[0].resultPerStation.filter(r => r.codeStation === this.station.properties.code).length > 0)) {
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
    }

    getSeries() {
        let series: any[] = [];
        let pie, piedata: any[]=[];
        let index = 0;
        let unit = this.translate.instant(this.type === 'B' ? 'BIOMASS_UNIT' : 'ABUNDANCY_UNIT');

        for (let i in this.species) {
            let data = this.fillData(this.species[i].code);
            series[index++] = {
                name: this.species[i].scientificName,
                type: 'spline',
                yAxis: 0,
                data: data.dataSpline,
                tooltip: {
                    headerFormat: '<em>' + unit + '</em><br/>',
                    pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} '+unit+'</b>'
                }
            }
            series[index++] = {
                name: this.species[i].scientificName,
                type: 'errorbar',
                yAxis: 0,
                data: data.dataError,
                tooltip: {
                    headerFormat: '<em>' + (this.type === 'B' ? "Kg/ha" : "ind./ha") + '</em><br/>',
                    pointFormat: '(standard deviation: {point.low}-{point.high} '+unit+'</b>'
                }
            }
            piedata[i] = {
                name: this.species[i].scientificName,
                y: data.dataPie,
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
