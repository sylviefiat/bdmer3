
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
        <bc-result-export-xls *ngIf="(analyseData$ | async) && (results$ | async)" [analyseData]="analyseData$ | async" [results]="results$ | async" [locale]="locale$ | async"></bc-result-export-xls>
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
       
      //const contentDataURL = canvas.toDataURL('image/png');
      const contentDataBlob = canvas.toBlob(blob => this.saveAs(blob, dashedName+'.png'));
      //let pdf = new jsPDF.default('p', 'mm', 'a4'); // A4 size page of PDF
      //const pdf = new jsPDF();
      //var position = 0;
      //pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      //pdf.save(dashedName+'.pdf'); // Generated PDF
      //this.saveAs(contentDataBlob, dashedName+'.pdf' );
    });
  }

  download(url, name, opts) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      saveAs(xhr.response, name, opts);
    };

    xhr.onerror = function () {
      console.error('could not download file');
    };

    xhr.send();
  }


  clicka(node) {
    console.log(node);
    try {
      node.dispatchEvent(new MouseEvent('click'));
    } catch (e) {
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }

  corsEnabled(url) {
    var xhr = new XMLHttpRequest(); // use sync to avoid popup blocker

    xhr.open('HEAD', url, false);
    xhr.send();
    return xhr.status >= 200 && xhr.status <= 299;
  } // `a.click()` doesn't work for all browsers (#465)


  saveAs(blob, name, opts?) {
    const self = this;
    var a = document.createElement('a');
    name = name || blob.name || 'download';
    a.download = name;
    a.rel = 'noopener'; // tabnabbing
    // TODO: detect chrome extensions & packaged apps
    //a.target = '_blank'

    if (typeof blob === 'string') {
      // Support regular links
      a.href = blob;

      if (a.origin !== location.origin) {
        this.corsEnabled(a.href) ? this.download(blob, name, opts) : this.clicka(a);
      } else {
        this.clicka(a);
      }
    } else {
      // Support blobs
      console.log(blob);
      a.href = URL.createObjectURL(blob);
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
      }, 4E4); // 40s

      setTimeout(function () {
        console.log("click");
        self.clicka(a);
      }, 0);
    }
  }

}
