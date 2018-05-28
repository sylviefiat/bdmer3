
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { IAppState } from '../../modules/ngrx/index';
import { Zone, Survey, Species, Transect } from '../../modules/datas/models/index';
import { ResultSurvey } from '../../modules/analyse/models/index';
declare var google: any;

@Component({
    selector: 'bc-result-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
  <div class="container">   
     <google-chart [data]="chartData"></google-chart>
   </div>
  `,
    styles: [
        `
   
  `]
})
export class ResultChartComponent implements OnInit/*, AfterViewInit*/ {
    @Input() resultSurveys: ResultSurvey[];
    @Input() type$: Observable<string>;
    @Input() chartType: string;
    @Input() surveyShow$: Observable<string>;
    chartData: any;
    resultSurvey: ResultSurvey;
    title: string;

    header: any[]=[];
    data: Observable<any[]>;

    constructor() {

    }

    ngOnInit() {
      this.surveyShow$.map(surveyShow => this.resultSurvey=this.resultSurveys.filter(rs => rs.codeSurvey === surveyShow)[0]);
      //if(!this.chartData){        
      this.type$.map(type => 

        this.chartData = {
            chartType: this.chartType,
            dataTable: [
                this.header,
                ...this.fillData(type)
            ],
            options: { 'legend': 'true', 'title': this.title },
        }
      )
    }

    fillData(type: string): any[]{
      let data: any[]=[];
      for(let i in this.resultSurvey.resultPerSpecies){
        data[i]=[];
        let value = type==='B'? this.resultSurvey.resultPerSpecies[i].biomassTotal:this.resultSurvey.resultPerSpecies[i].numberIndividual;
        let sd = type==='B'? this.resultSurvey.resultPerSpecies[i].SDBiomassTotal:this.resultSurvey.resultPerSpecies[i].SDAbundancyTotal;
        this.title = type==='B'? 'Biomass':'Abundance';
        if(this.chartType==='CandlestickChart'){          
          if(this.header.length<=0) this.header=[this.resultSurvey.codeSurvey,this.title,'','',''];
          data[i]=[this.resultSurvey.resultPerSpecies[i].codeSpecies,value-sd,value,value,value+sd];
        } else if(this.chartType==='PieChart') {
          if(this.header.length<=0) this.header=[this.resultSurvey.codeSurvey,this.title];
          data[i]=[this.resultSurvey.resultPerSpecies[i].codeSpecies,value];
        }
      }
      return data;
    }


}
