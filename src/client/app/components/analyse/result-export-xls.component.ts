
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

import { IAppState } from '../../modules/ngrx/index';
import { Platform, Zone, Survey, Station, Species } from '../../modules/datas/models/index';
import { Results, Data, ResultPlatformExport, ResultZoneExport, ResultStationExport } from '../../modules/analyse/models/index';

//import { utils, write, WorkBook } from 'xlsx';
import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';

@Component({
  selector: 'bc-result-export-xls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `  

  <fa [name]="'file-excel-o'" [border]=true [size]=1></fa>
  <mat-form-field>         
    <mat-select  placeholder="{{'EXCEL_EXPORT' | translate}}" (selectionChange)="export($event.value)">
      <mat-option [value]="'platform'">{{ 'RESULT_PER_PLATFORM' | translate}}</mat-option>
      <mat-option [value]="'zone'">{{ 'RESULT_PER_ZONE' | translate}}</mat-option>
      <mat-option [value]="'station'">{{ 'RESULT_PER_STATION' | translate}}</mat-option>
      <mat-option [value]="'survey'">{{ 'RESULT_PER_SURVEY' | translate}}</mat-option>
    </mat-select>
  </mat-form-field>

  `,
  styles: [
    `
    .host {
      padding-right:15px;
    }
    `]
})
export class ResultExportXlsComponent implements OnInit {
  @Input() analyseData: Data;
  @Input() results: Results;
  @Input() locale: string;
  headers;
  modelPlatform: ResultPlatformExport = { codePlatform: "", surface: 0, surfaceTotal: 0, nbZones: 0, nbZonesTotal: 0, nbStations: 0, nbStationsTotal: 0, nbCatches: 0, fishingEffort:0 };  
  modelZone: ResultZoneExport = { codeZone: "", codePlatform: "", surface: 0, nbStations: 0, nbCatches: 0, fishingEffort:0 };
  modelStation: ResultStationExport = { codeStation: "", latitude: 0, longitude: 0, surface: 0, nbCatches: 0, nbDivers: 0, densityPerHA:0 };
  ALL = "all";


  constructor(private translate: TranslateService) {

  }

  ngOnInit() {
  }

  export(type) {
    let wb: XLSX.WorkBook = { SheetNames: [], Sheets: {} };
    let fileName = this.results.name.replace(' ', '-')+'-'+type+'.xlsx'; 
    switch (type) {
      case "platform":
        wb = this.exportPerPlatform(wb);
        break;
      case "zone":
        wb = this.exportPerZone(wb);
        break;
      case "station":
        wb = this.exportPerStation(wb);
        break;
      case "survey":
        wb = this.exportPerSurvey(wb);
        break;
      default:
        break;
    }
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    let blob = new Blob([this.s2ab(wbout)], { type: "**application/octet-stream**" });
    saveAs(blob, fileName );
  }

  exportPerPlatform(wb: XLSX.WorkBook) {    
    let ws = [];
    
    for (let resultspecies of this.results.resultAll) {
      let ws_name = resultspecies.nameSpecies;
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = XLSX.utils.json_to_sheet(this.flat(resultspecies.resultPerPlatform, { speciesCode: resultspecies.nameSpecies },this.modelPlatform),{skipHeader:true});
    }
    return wb;       
  }

  exportPerZone(wb: XLSX.WorkBook) {
    let ws = [];
    for (let resultspecies of this.results.resultAll) {
      let ws_name = resultspecies.nameSpecies;
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = XLSX.utils.json_to_sheet(this.flat(resultspecies.resultPerZone, { speciesCode: resultspecies.nameSpecies }, this.modelZone),{skipHeader:true});
    }
    return wb; 
  }

  exportPerStation(wb: XLSX.WorkBook) {
    let ws = [];
    for (let resultspecies of this.results.resultAll) {
      let ws_name = resultspecies.nameSpecies;
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = XLSX.utils.json_to_sheet(this.flat(resultspecies.resultPerStation, { speciesCode: resultspecies.nameSpecies }, this.modelStation),{skipHeader:true});
    }
    return wb; 
  }

  exportPerSurvey(wb: XLSX.WorkBook) {
    let ws = [], ws_temp = [];
    for (let resultSurvey of this.results.resultPerSurvey) {
      for (let resultspecies of resultSurvey.resultPerSpecies) {
        let ws_name = resultspecies.nameSpecies;
        if (wb.SheetNames.indexOf(ws_name) < 0) {
          wb.SheetNames.push(ws_name);
          ws_temp[ws_name] = [];
        }
        ws_temp[ws_name] = [...ws_temp[ws_name], ...this.flat(resultspecies.resultPerPlatform, { surveyCode: resultSurvey.codeSurvey }, this.modelPlatform)];
      }
    }
    for(let name in ws_temp){
      wb.Sheets[name] = XLSX.utils.json_to_sheet(ws_temp[name],{skipHeader:true});
    }
    return wb; 
  }

  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    };
    return buf;
  }

  flat(data, addedProperties, model?): any {
    let flatArray = [];
    let header = [];    

    for (let i = 0; i < data.length; i++) {
      let flatObject = {};
      let prop0 = null;
      var charCode = "A".charCodeAt(0);
      let index = String.fromCharCode(charCode);

      for (let prop in addedProperties) {
        if(header.indexOf(index)<0){header[index]=this.getTranslateName(prop);}
        flatObject[index] = Number.isNaN(addedProperties[prop]) ? "" : ""+addedProperties[prop];
        index = String.fromCharCode(++charCode);
      }
      for (let prop in data[i]) {
        prop0 = prop0 === null ? prop : prop0;

        if (typeof data[i][prop] === 'object') {
          for (var inProp in data[i][prop]) {
            if (!model || data[i][prop0].toLowerCase() == this.ALL || model.hasOwnProperty(inProp)) {
              if(header.indexOf(index)<0){header[index]=this.getTranslateName(inProp);}
              flatObject[index] = (Number.isNaN(data[i][prop][inProp]) || data[i][prop][inProp].length <= 0) ? "" : ""+data[i][prop][inProp];
              index = String.fromCharCode(++charCode);
            }
          }
        } else {
          if (!model || data[i][prop0].toLowerCase() === this.ALL || model.hasOwnProperty(prop)) {
            if(header.indexOf(index)<0){header[index]=this.getTranslateName(prop);}
            flatObject[index] = (Number.isNaN(data[i][prop]) || data[i][prop].length <= 0) ? "" : ""+data[i][prop];
            index = String.fromCharCode(++charCode);
          }
        }
      }
      if(flatArray.length===0){
        flatArray.push(header);
      }
      flatArray.push(flatObject);
    }
    return flatArray;
  }

  getTranslateName(name) {
    let bigName = name.replace(/\.?([A-Z]+)/g, function(x, y) { return "_" + y.toLowerCase() }).replace(/^_/, "");
    bigName = bigName.toUpperCase();
    let translate = this.translate.instant(bigName);
    return translate;
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
      a.href = URL.createObjectURL(blob);
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
      }, 4E4); // 40s

      setTimeout(function () {
        self.clicka(a);
      }, 0);
    }
  }


}
