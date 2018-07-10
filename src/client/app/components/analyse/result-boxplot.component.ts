
import { Component, OnInit, OnChanges, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource }  from '@angular/material';

import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);

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
          style="height: 400px; display: block;">
      </highcharts-chart>
      <mat-table #table [dataSource]="displayedColumns" class="mat-elevation-z8">

         <ng-container *ngFor="let disCol of headerRow; let colIndex = index" matColumnDef='{{disCol}}'>
            <mat-header-cell *matHeaderCellDef>{{disCol}}</mat-header-cell>
            <mat-cell *matCellDef="let element " (click)="write(element,disCol)"> {{ getElement(element,disCol) }} </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="headerRow"></mat-header-row>
        <mat-row *matRowDef="let row; columns: headerRow;"></mat-row>
    </mat-table>
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
    @Input() years: string[];
    @Input() chartsData: ChartsStation;
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
        this.setTable();
        this.loading = false;
    }

    ngOnChanges(event) {

        if (event.type !== null && event.type.previousValue !== undefined) {
            this.getChartOptions();
            this.setTable();
        }
    }

    getChartOptions() {
        
        this.series = this.getSeries();
        this.chartOptions = {
            chart: {
                type: 'boxplot'
            },

            title: {
                text: this.translate.instant('STATION') + " " + this.chartsData.code + " <i>(" + this.translate.instant((this.type === 'B') ? 'BIOMASS' : 'ABUNDANCY') + ")</i>"
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

        for (let i in this.chartsData.species) {
            series[index++] = {
                name: this.chartsData.species[i].scientificName,
                type: 'spline',
                yAxis: 0,
                data: this.chartsData.dataSpline[i],
                tooltip: {
                    headerFormat: '<em>' + unit + '</em><br/>',
                    pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} ' + unit + '</b>'
                }
            }
            series[index++] = {
                name: this.chartsData.species[i].scientificName,
                type: 'errorbar',
                yAxis: 0,
                data: this.chartsData.dataError[i],
                tooltip: {
                    headerFormat: '<em>' + (this.type === 'B' ? "Kg/ha" : "ind./ha") + '</em><br/>',
                    pointFormat: '(standard deviation: {point.low}-{point.high} ' + unit + '</b>'
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
            name: this.translate.instant('PIE_LEGEND'),
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

    setTable(){
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
    }

   


}
