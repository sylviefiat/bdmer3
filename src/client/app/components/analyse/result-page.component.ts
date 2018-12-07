
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IAppState, getAnalyseData, getAnalyseResult, getLangues, isAnalysing, isAnalysed } from '../../modules/ngrx/index';
import { Platform, Zone, Survey, Station, Species } from '../../modules/datas/models/index';
import { Method, Results, Data } from '../../modules/analyse/models/index';
import { IAnalyseState } from '../../modules/analyse/states/index';
import { Country } from '../../modules/countries/models/country';
import { CountriesAction, CountryAction } from '../../modules/countries/actions/index';
import { PlatformAction, SpeciesAction } from '../../modules/datas/actions/index';
import { AnalyseAction } from '../../modules/analyse/actions/index';

import { jsPDF } from 'jspdf';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'bc-result-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `   
    <mat-card>
      <mat-card-title>{{ (results$ | async)?.name }}</mat-card-title>
      <mat-card-actions>
        <bc-result-rappel *ngIf="analyseData$ | async" [analyseData]="analyseData$ | async" [locale]="locale$ | async"></bc-result-rappel>
      </mat-card-actions>
      
    </mat-card>
    
    <div class="main" id="canvasToPrint">
      <bc-result-synthesis *ngIf="results$ | async" [results]="results$ | async" [analyseData]="analyseData$ | async" [locale]="locale$ | async"></bc-result-synthesis>
      <div class="loader" *ngIf="!(results$ | async)">
        <div class="lds-dual-ring"></div>
      </div>
    </div>

    <div>
      <button (click)="captureScreen()">PRINT</button>
      <bc-result-export-xls [analyseData]="analyseData$ | async" [results]="results$ | async" [locale]="locale$ | async"></bc-result-export-xls>
    </div>
  `,
  styles: [
    `
  mat-card-title, mat-card-content, mat-card-actions {
    display: flex;
    justify-content: center;
  }

  .main {
    margin: 72px 0;
  }
  .loader {
    width: 100%;
    text-align:center;
  }
  .lds-dual-ring {      
      display: inline-block;
      width: 64px;
      height: 64px;
      z-index: 100000;
    }
    .lds-dual-ring:after {
      content: " ";
      display: block;
      width: 46px;
      height: 46px;
      margin: 1px;
      border-radius: 50%;
      border: 5px solid #fff;
      border-color: #000 transparent #000 transparent;
      animation: lds-dual-ring 1.2s linear infinite;
      z-index: 100000;
    }
    @keyframes lds-dual-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    `]
})
export class ResultPageComponent implements OnInit, AfterViewInit {
  analyseData$: Observable<Data>;
  results$: Observable<Results>;
  locale$: Observable<string>;
  loading: boolean;
  analyseName: string;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    
  }

  ngOnInit() {    
    this.loading=true;
    this.analyseData$ = this.store.select(getAnalyseData);
    this.results$ = this.store.select(getAnalyseResult);
    this.locale$ = this.store.select(getLangues);
    
    this.analyseData$.subscribe(d => {
      console.log(d);
      if(!d || !d.usedCountry){ 
        this.routerext.navigate(['/analyse']);
      }
    });
    this.results$.subscribe(result => this.analyseName = result ? result.name : '');
  }

  ngAfterViewInit(){
    this.loading=false;

  }

  public captureScreen(){
    let dashedName = this.analyseName.replace(' ','-');
    var data = document.getElementById('canvasToPrint');
    html2canvas(data).then((canvas) => {
    // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
       
      const contentDataURL = canvas.toDataURL('image/png');
      //let pdf = new jsPDF.default('p', 'mm', 'a4'); // A4 size page of PDF
      const pdf = new jsPDF();
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save(dashedName+'.pdf'); // Generated PDF
    });
  }

}
