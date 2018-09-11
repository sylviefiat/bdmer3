
import { Component, OnInit, OnChanges, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material';

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
    @Input() species: Species[];
    @Input() zone?: Zone;
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

    getElement(mot, i) {
        return mot["\"" + i + "\""];
    }

    ngOnInit() {
        this.getChartOptions();
    }

    ngOnChanges(event) {

        if (event.type !== null && event.type.previousValue !== undefined) {
            this.getChartOptions();
            //this.setTable();
        }
    }

    getChartOptions() {
        let title="";
        if(this.zone){
            this.series = this.getSeriesZone();
            title = this.translate.instant('RESULTS_ZONE') + " " + this.zone.properties.code;
        } else {
            this.series = this.getSeriesPlatforms();
            title = this.translate.instant('RESULTS_PLATFORMS');
        }
        this.chartOptions = {
            chart: {
                type: 'boxplot'
            },

            title: {
                text: title + " <i>(" + this.translate.instant((this.type === 'B') ? 'BIOMASS' : 'ABUNDANCY') + ")</i>"
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

    getSeriesPlatforms() {
        let series: any[] = [];
        let data: any[][][] = [];
        let index = 0;
        let unit = this.translate.instant(this.type === 'B' ? 'BIOMASS_UNIT' : 'ABUNDANCY_UNIT');
        for (let rps of this.chartsData.resultPerSurvey) {
            if (!data[rps.codePlatform]) {
                data[rps.codePlatform] = [];
            }
            for (let sp of this.species) {
                if (!data[rps.codePlatform][sp.scientificName]) {
                    data[rps.codePlatform][sp.scientificName] = [];
                }
                let rspp = rps.resultPerSpecies.filter(rs => rs.codeSpecies === sp.code).length > 0 ? rps.resultPerSpecies.filter(rs => rs.codeSpecies === sp.code)[0] : null;
                let value = rspp ? (this.type === 'B' ? Number(rspp.resultPerPlatform.map(rpp => rpp.averageBiomass)) : Number(rspp.resultPerPlatform.map(rpp => rpp.averageAbundance))) : null;
                data[rps.codePlatform][sp.scientificName] = [...data[rps.codePlatform][sp.scientificName], value];
            }
        }
        for (let i in data) {
            for (let j in data[i]) {
                series[index++] = {
                    name: i + " / " + j,
                    type: 'spline',
                    yAxis: 0,
                    data: data[i][j],
                    tooltip: {
                        headerFormat: '<em>' + unit + '</em><br/>',
                        pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} ' + unit + '</b>'
                    }
                }
            }
        }
        return series;
    }

    getSeriesZone() {
        let series: any[] = [];
        let data: any[][][] = [];
        let index = 0;
        let unit = this.translate.instant(this.type === 'B' ? 'BIOMASS_UNIT' : 'ABUNDANCY_UNIT');
        for (let rps of this.chartsData.resultPerSurvey) {
            if (!data[this.zone.properties.code]) {
                data[this.zone.properties.code] = [];
            }
            for (let sp of this.species) {
                if (!data[this.zone.properties.code][sp.scientificName]) {
                    data[this.zone.properties.code][sp.scientificName] = [];
                }
                let rspp = rps.resultPerSpecies.filter(rs => rs.codeSpecies === sp.code).length > 0 ? rps.resultPerSpecies.filter(rs => rs.codeSpecies === sp.code)[0] : null;
                let rpz = rspp ? rspp.resultPerZone.filter(z=>z.codeZone===this.zone.properties.code):null;
                let value = rpz ? (this.type === 'B' ? rpz.map(rpp => rpp.averageBiomass) : rpz.map(rpp => rpp.averageAbundance)) : null;
                data[this.zone.properties.code][sp.scientificName] = [...data[this.zone.properties.code][sp.scientificName], ...value];
            }
        }
        for (let i in data) {
            for (let j in data[i]) {
                series[index++] = {
                    name: i + " / " + j,
                    type: 'spline',
                    yAxis: 0,
                    data: data[i][j],
                    tooltip: {
                        headerFormat: '<em>' + unit + '</em><br/>',
                        pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} ' + unit + '</b>'
                    }
                }
            }
        }
        return series;
    }



}
