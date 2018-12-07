
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

import { IAppState } from '../../modules/ngrx/index';
import { Platform, Zone, Survey, Station, Species } from '../../modules/datas/models/index';
import { Results, Data } from '../../modules/analyse/models/index';

import { utils, write, WorkBook } from 'xlsx';

import { saveAs } from 'file-saver';

@Component({
    selector: 'bc-result-export-xls',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `   
    <button (click)="exportPerPlatform()">Export Excel platforms results</button>
    <button (click)="exportPerZone()">Export Excel zones results</button>
    <button (click)="exportPerStation()">Export Excel stations results</button>
  `,
    styles: [
        `
    `]
})
export class ResultExportXlsComponent implements OnInit {
    @Input() analyseData: Data;
    @Input() results: Results;
    @Input() locale: string;    

    constructor(private translate: TranslateService) {

    }

    ngOnInit() {
    }

    exportPerPlatform() {
        let wb: WorkBook = { SheetNames: [], Sheets: {} };
        let dashedName = this.results.name.replace(' ', '-');
        let ws = [];
        for (let resultspecies of this.results.resultAll) {
            let ws_name = resultspecies.nameSpecies;
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = utils.json_to_sheet(this.flat(resultspecies.resultPerPlatform));
            
        }

        const wbout = write(wb, {
            bookType: 'xlsx', bookSST: true, type:
                'binary'
        });
        saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), dashedName + '-platforms.xlsx');
    }

    exportPerZone() {
      
    }

    exportPerStation() {

    }

    s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF;
        };
        return buf;
    }

    flat(data): any[] {
        let flatArray = [];        
        for(let i=0; i < data.length; i++) {
          console.log(data[i]);
          let flatObject = {};
          for (let prop in data[i]) {
              if (typeof data[i][prop] === 'object') {
                  for (var inProp in data[i][prop]) {
                      flatObject[this.getTranslateName(inProp)] = data[i][prop][inProp];
                  }
              } else {
                  flatObject[this.getTranslateName(prop)] = data[i][prop];
              }
          }
          flatArray.push(flatObject);
        }
        return flatArray;
    }

    getTranslateName(name){
      let translate = this.translate.instant(name.replace(/([A-Z])/g, (g) => g[0].toUpperCase()));
      console.log(translate);
      return translate;
    }

}
