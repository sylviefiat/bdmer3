
import { Component, OnInit, OnChanges, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);


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
    @Input() resultSurveys: ResultSurvey[];
    @Input() usedSurveys: Survey[];
    @Input() type: string;
    @Input() years: string[];
    @Input() species: Species[];
    Highcharts = Highcharts;
    chartOptions: any;
    title: string;

    constructor() {

    }

    ngOnInit() {
        this.getChartOptions();
    }

    ngOnChanges(event){
        console.log(event);
        this.getChartOptions();
    }

    getChartOptions() {
        this.chartOptions = {
            chart: {
                type: 'boxplot'
            },

            title: {
                text: this.type === 'B' ? 'Biomass' : 'Abundance'
            },
            legend: {
                enabled: true
            },

            xAxis: {
                categories: this.years,
                title: {
                    text: 'Years'
                }
            },
            yAxis: {
                title: {
                    text: 'Observations'
                }
            },
            series: this.getSeries()
        };
        console.log(this.chartOptions);
    }

    fillData(codeSp: string): any {
        let dataSpline: any[] = [];
        let dataError: any[] = [];
        console.log(codeSp);
        for(let i in this.resultSurveys){
            let rs =this.resultSurveys[i];
            let currentDate = new Date(this.usedSurveys.filter(s=>rs.codeSurvey===s.code)[0].dateStart);
            let currentYear =currentDate.getFullYear();
            let currentIndex = this.years.indexOf(currentYear.toString());
            if(rs.resultPerSpecies.filter(rps => rps.codeSpecies===codeSp)===null || rs.resultPerSpecies.filter(rps => rps.codeSpecies===codeSp).length<=0){                
                dataSpline[currentIndex] = 0;
                dataError[currentIndex] = [0,0];
            } else {
                let rsp = rs.resultPerSpecies.filter(rps => rps.codeSpecies===codeSp)[0];
                console.log(rsp);
                let value = this.type === 'B' ? rsp.biomassTotal : rsp.numberIndividual;
                let sd = this.type === 'B' ? rsp.SDBiomassTotal : rsp.SDAbundancyTotal;
                dataSpline[currentIndex] = value;
                dataError[currentIndex] = [value - sd, value + sd];
            }
        }
        console.log(dataSpline);
        return {dataSpline,dataError};
    }

    getSeries(){
        let series: any[] = [];
        let index = 0;
        
        for(let i in this.species) {
            let data = this.fillData(this.species[i].code);
            series[index++]={
                name:this.species[i].scientificName,
                type: 'spline',
                yAxis: 0,
                data: data.dataSpline,
                tooltip: {
                    headerFormat: '<em>'+(this.type==='B'?"Kg/ha":"ind./ha")+'</em><br/>',
                    pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} {this.type==="B"?"Kg/ha":"ind./ha"}</b>'
                }
            }
            series[index++]={
                name:this.species[i].scientificName,
                type: 'errorbar',
                yAxis: 0,
                data: data.dataError,
                tooltip: {
                    headerFormat: '<em>'+(this.type==='B'?"Kg/ha":"ind./ha")+'</em><br/>',
                    pointFormat: '(error range: {point.low}-{point.high} {this.type==="B"?"Kg/ha":"ind./ha"}</b>'
                }
            }
        }
        return series;
    }


}
