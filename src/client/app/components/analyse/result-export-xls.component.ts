
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
    <button (click)="exportPerPlatform()">{{'EXCEL_EXPORT' | translate}} {{'RESULT_PER_PLATFORM' | translate}}</button>
    <button (click)="exportPerZone()">{{'EXCEL_EXPORT' | translate}} {{'RESULT_PER_ZONE' | translate}}</button>
    <button (click)="exportPerStation()">{{'EXCEL_EXPORT' | translate}} {{'RESULT_PER_STATION' | translate}}</button>
    <button (click)="exportPerSurvey()">{{'EXCEL_EXPORT' | translate}} {{'RESULT_PER_SURVEY' | translate}}</button>
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
            wb.Sheets[ws_name] = utils.json_to_sheet(this.flat(resultspecies.resultPerPlatform, {speciesCode: resultspecies.nameSpecies}));
        }

        const wbout = write(wb, {
            bookType: 'xlsx', bookSST: true, type:
                'binary'
        });
        saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), dashedName + '-platforms.xlsx');
    }

    exportPerZone() {
      let wb: WorkBook = { SheetNames: [], Sheets: {} };
        let dashedName = this.results.name.replace(' ', '-');
        let ws = [];
        for (let resultspecies of this.results.resultAll) {
            let ws_name = resultspecies.nameSpecies;
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = utils.json_to_sheet(this.flat(resultspecies.resultPerZone, {speciesCode: resultspecies.nameSpecies}));            
        }

        const wbout = write(wb, {
            bookType: 'xlsx', bookSST: true, type:
                'binary'
        });
        saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), dashedName + '-zones.xlsx');
    }

    exportPerStation() {
      let wb: WorkBook = { SheetNames: [], Sheets: {} };
        let dashedName = this.results.name.replace(' ', '-');
        let ws = [];
        for (let resultspecies of this.results.resultAll) {
            let ws_name = resultspecies.nameSpecies;
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = utils.json_to_sheet(this.flat(resultspecies.resultPerStation,{speciesCode: resultspecies.nameSpecies}));            
        }

        const wbout = write(wb, {
            bookType: 'xlsx', bookSST: true, type:
                'binary'
        });
        saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), dashedName + '-stations.xlsx');
    }

    exportPerSurvey() {
      let wb: WorkBook = { SheetNames: [], Sheets: {} };
        let dashedName = this.results.name.replace(' ', '-');
        let ws = [], ws_temp = [];
        for(let resultSurvey of this.results.resultPerSurvey){
          for (let resultspecies of resultSurvey.resultPerSpecies) {              
              let ws_name =  resultspecies.nameSpecies;
              if(wb.SheetNames.indexOf(ws_name)<0){
                wb.SheetNames.push(ws_name);  
                ws_temp[ws_name] = [];
              }              
              ws_temp[ws_name]=[...ws_temp[ws_name],...this.flat(resultspecies.resultPerPlatform,{surveyCode:resultSurvey.codeSurvey})];
          }
        }
        for(let name in ws_temp){
          wb.Sheets[name] = utils.json_to_sheet(ws_temp[name]);
        }
        const wbout = write(wb, {
            bookType: 'xlsx', bookSST: true, type:
                'binary'
        });
        saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), dashedName + '-surveys.xlsx');
    }

    s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF;
        };
        return buf;
    }

    flat(data, addedProperties): any[] {
        let flatArray = [];

        for(let i=0; i < data.length; i++) {
          let flatObject = {};
          for (let prop in addedProperties) {
            flatObject[this.getTranslateName(prop)] = Number.isNaN(addedProperties[prop])?0:addedProperties[prop];
          }
          for (let prop in data[i]) {
              if (typeof data[i][prop] === 'object') {
                  for (var inProp in data[i][prop]) {
                      flatObject[this.getTranslateName(inProp)] = (Number.isNaN(data[i][prop][inProp]) || data[i][prop][inProp].length<=0)?0:data[i][prop][inProp];
                  }
              } else {
                  flatObject[this.getTranslateName(prop)] = (Number.isNaN(data[i][prop]) || data[i][prop].length<=0)?0:data[i][prop];
              }
          }
          flatArray.push(flatObject);
        }
        return flatArray;
    }

    getTranslateName(name){
      let bigName= name.replace(/\.?([A-Z]+)/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");
      bigName = bigName.toUpperCase();
      let translate = this.translate.instant(bigName);
      return translate;
    }

}
