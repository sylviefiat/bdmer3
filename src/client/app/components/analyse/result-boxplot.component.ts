
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
      <highcharts-chart
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
    @Input() codeZone?: string;
    Highcharts = Highcharts;
    chartOptions: any;
    title: string;
    loading: boolean = false;
    series: any[] = [];
    headerRow: any = [];
    colors: any = [];
    table: any = [];
    yAxis: any = [];
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
        if ((event.type && event.type.previousValue !== undefined) || (event.codeZone && event.codeZone.previousValue !== undefined)) {
            this.getChartOptions();
        }
    }

    getChartOptions() {
        let title = "";        
        if (this.codeZone) {
            this.series = this.getSeriesZone();
            title = this.translate.instant('RESULTS_ZONE') + " " + this.codeZone;
        } else {
            this.series = this.getSeriesPlatforms();
            title = this.translate.instant('RESULTS_PLATFORMS');
        }
        this.chartOptions = {
            chart: {
                type: 'boxplot'
            },
            colors: this.colors,
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
            tooltip: {
                shared: true
            },
            series: this.series
        };
    }

    getSeriesPlatforms() {
        let hcolors = Highcharts.getOptions().colors;
        let series: any[] = [];
        let dataScatter: any[][][] = [];
        let dataConfidence: any[][][] = [];
        let index = 0, colori = 0, i = 0;
        let unit = this.translate.instant(this.type === 'B' ? 'BIOMASS_UNIT' : 'ABUNDANCY_UNIT');
        let type = this.translate.instant(this.type === 'B' ? 'BIOMASS' : 'ABUNDANCY');
        for (let rps of this.chartsData.resultPerSurvey) {
            if (!dataScatter[rps.codePlatform]) {
                dataScatter[rps.codePlatform] = [];
                dataConfidence[rps.codePlatform] = [];
            }
            for (let sp of this.species) {
                if (!dataScatter[rps.codePlatform][sp.scientificName]) {
                    dataScatter[rps.codePlatform][sp.scientificName] = [];
                    dataConfidence[rps.codePlatform][sp.scientificName] = [];
                }
                let rspp = rps.resultPerSpecies.filter(rs => rs.codeSpecies === sp.code).length > 0 ? rps.resultPerSpecies.filter(rs => rs.codeSpecies === sp.code)[0] : null;
                let value = rspp ? (this.type === 'B' ? Number(rspp.resultPerPlatform.map(rpp => rpp.averageBiomass)) : Number(rspp.resultPerPlatform.map(rpp => rpp.averageAbundance))) : null;
                let valuConf = rspp ? (this.type === 'B' ? Number(rspp.resultPerPlatform.map(rpp => rpp.confidenceIntervalBiomass)) : Number(rspp.resultPerPlatform.map(rpp => rpp.confidenceIntervalAbundance))) : (value ? 0 : null);
                dataScatter[rps.codePlatform][sp.scientificName] = [...dataScatter[rps.codePlatform][sp.scientificName], Number(value)];
                dataConfidence[rps.codePlatform][sp.scientificName] = [...dataConfidence[rps.codePlatform][sp.scientificName], [Number(value) - Number(valuConf), Number(value) + Number(valuConf)]];
                this.colors[colori++] = Highcharts.Color(hcolors[i]).brighten(0.2).get();
                this.colors[colori++] = hcolors[i++];

            }
        }
        colori=0;
        for (let i in dataScatter) {
            for (let j in dataScatter[i]) {
                series[index++] = {
                    name: i + " / " + j,
                    type: 'columnrange',
                    yAxis: 0,
                    showInLegend:true,
                    data: dataConfidence[i][j],                    
                    tooltip: {
                        pointFormat: '(confidence interval <b>{point.low:.1f}-{point.high:.1f} ' + unit + ')</b>'
                    }
                }
                series[index++] = {
                    name: i + " / " + j,
                    type: 'scatter',
                    yAxis: 0,
                    data: dataScatter[i][j],
                    tooltip: {
                        headerFormat: '<em>'+type+'</em><br/>',
                        pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} ' + unit + '</b>'
                    }
                }
            }
        }
        return series;
    }

    getSeriesZone() {
        let hcolors = Highcharts.getOptions().colors;
        let series: any[] = [];
        let dataScatter: any[][][] = [];
        let dataSD: any[][][] = [];
        let index = 0, colori = 0, i = 0;
        let unit = this.translate.instant(this.type === 'B' ? 'BIOMASS_UNIT' : 'ABUNDANCY_UNIT');
        let type = this.translate.instant(this.type === 'B' ? 'BIOMASS' : 'ABUNDANCY');
        for (let rps of this.chartsData.resultPerSurvey) {
            if (!dataScatter[this.codeZone]) {
                dataScatter[this.codeZone] = [];
                dataSD[this.codeZone] = [];
            }
            for (let sp of this.species) {
                if (!dataScatter[this.codeZone][sp.scientificName]) {
                    dataScatter[this.codeZone][sp.scientificName] = [];
                    dataSD[this.codeZone][sp.scientificName] = [];
                }
                let rspp = rps.resultPerSpecies.filter(rs => rs.codeSpecies === sp.code).length > 0 ? rps.resultPerSpecies.filter(rs => rs.codeSpecies === sp.code)[0] : null;
                let rpz = rspp ? rspp.resultPerZone.filter(z => z.codeZone === this.codeZone) : null;
                let value = rpz ? (this.type === 'B' ? rpz.map(rpp => rpp.biomassPerHA) : rpz.map(rpp => rpp.abundancePerHA)) : null;
                let valuConf = rpz ? (this.type === 'B' ? rpz.map(rpp => rpp.SDBiomassPerHA) : rpz.map(rpp => rpp.SDabundancePerHA)) : (value ? 0 : null);
                dataScatter[this.codeZone][sp.scientificName] = [...dataScatter[this.codeZone][sp.scientificName], value];
                dataSD[this.codeZone][sp.scientificName] = [...dataSD[this.codeZone][sp.scientificName], [Number(value) - Number(valuConf), Number(value) + Number(valuConf)]];
                this.colors[colori++] = hcolors[i];
                this.colors[colori++] = Highcharts.Color(hcolors[i]).brighten(0.2).get();
            }
        }
        colori=0;
        for (let i in dataScatter) {
            for (let j in dataScatter[i]) {

                series[index++] = {
                    name: i + " / " + j,
                    type: 'column',
                    yAxis: 0,
                    data: dataScatter[i][j],
                    tooltip: {
                        headerFormat: '<em>' + type + '</em><br/>',
                        pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} ' + unit + '</b>'
                    }
                }
                series[index++] = {
                    name: i + " / " + j,
                    type: 'errorbar',
                    yAxis: 0,
                    showInLegend:false,
                    data: dataSD[i][j],
                    tooltip: {
                        pointFormat: '(standard deviation <b>{point.low:.1f}-{point.high:.1f} ' + unit + ')</br>'
                    }
                }
            }
        }
        return series;
    }

   /* addYAxis(index) {
        if(index===0){
            return { // Primary yAxis
                labels: {
                    format: '{value} '+this.translate.instant(this.type === 'B' ? 'BIOMASS_UNIT' : 'ABUNDANCY_UNIT')
                },
                title: {
                    text: this.translate.instant(this.type === 'B' ? 'BIOMASS' : 'ABUNDANCY')                   
                }
            }
        } else {
            return {
                visible: false
            }
        }
    }*/

}
