import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as togeojson from '@mapbox/togeojson';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getLangues } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-zone-import',
    templateUrl: './zone-import.component.html',
    styleUrls: [
        './zone-import.component.css',
    ],
})
export class ZoneImportComponent implements OnInit{
    @Input() platform: Platform;
    @Input() error: string | null;
    @Input() msg: string | null;
    @Output() upload = new EventEmitter<any>();
    @Output() err = new EventEmitter<string>();
    @Output() back = new EventEmitter();

    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
    }

    ngOnInit() {

        console.log(this.platform)
        // this.store.let(getLangues).subscribe((l: any) => {
        //     this.docs_repo = "../../../assets/files/";
        //     this.csvFile = "importZone-"+l+".csv";
        // });
    }

    kmlToGeoJson(kml){
      return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(kml);

            const self = this;

            reader.onload = function(event) {
              const parser = new DOMParser();
              const x = parser.parseFromString(reader.result, 'application/xml')
              const geojson = togeojson.kml(x).features;

              for(var i  in geojson){

                delete geojson[i].properties['styleHash'];
                delete geojson[i].properties['styleMapHash'];
                delete geojson[i].properties['styleUrl'];

                geojson[i].properties.codezone = self.platform.code+"_"+self.convertName(geojson[i].properties.name).split(' ').join('-').replace(/[^a-zA-Z0-9]/g,'');

              }
              resolve();
            };
      });
        
    }


    handleUpload(kmlFile: any): void {
      const self = this;
        if (kmlFile.target.files && kmlFile.target.files.length > 0) {
          this.kmlToGeoJson(kmlFile.target.files['0']).then(function(data){
            //console.log(data)
            //self.upload.emit(data);
          })
        }
    }

    convertName(str){
      var conversions = new Object();
      conversions['ae'] = 'ä|æ|ǽ';
      conversions['oe'] = 'ö|œ';
      conversions['ue'] = 'ü';
      conversions['Ae'] = 'Ä';
      conversions['Ue'] = 'Ü';
      conversions['Oe'] = 'Ö';
      conversions['A'] = 'À|Á|Â|Ã|Ä|Å|Ǻ|Ā|Ă|Ą|Ǎ';
      conversions['a'] = 'à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª';
      conversions['C'] = 'Ç|Ć|Ĉ|Ċ|Č';
      conversions['c'] = 'ç|ć|ĉ|ċ|č';
      conversions['D'] = 'Ð|Ď|Đ';
      conversions['d'] = 'ð|ď|đ';
      conversions['E'] = 'È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě';
      conversions['e'] = 'è|é|ê|ë|ē|ĕ|ė|ę|ě';
      conversions['G'] = 'Ĝ|Ğ|Ġ|Ģ';
      conversions['g'] = 'ĝ|ğ|ġ|ģ';
      conversions['H'] = 'Ĥ|Ħ';
      conversions['h'] = 'ĥ|ħ';
      conversions['I'] = 'Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ';
      conversions['i'] = 'ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı';
      conversions['J'] = 'Ĵ';
      conversions['j'] = 'ĵ';
      conversions['K'] = 'Ķ';
      conversions['k'] = 'ķ';
      conversions['L'] = 'Ĺ|Ļ|Ľ|Ŀ|Ł';
      conversions['l'] = 'ĺ|ļ|ľ|ŀ|ł';
      conversions['N'] = 'Ñ|Ń|Ņ|Ň';
      conversions['n'] = 'ñ|ń|ņ|ň|ŉ';
      conversions['O'] = 'Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ';
      conversions['o'] = 'ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º';
      conversions['R'] = 'Ŕ|Ŗ|Ř';
      conversions['r'] = 'ŕ|ŗ|ř';
      conversions['S'] = 'Ś|Ŝ|Ş|Š';
      conversions['s'] = 'ś|ŝ|ş|š|ſ';
      conversions['T'] = 'Ţ|Ť|Ŧ';
      conversions['t'] = 'ţ|ť|ŧ';
      conversions['U'] = 'Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ';
      conversions['u'] = 'ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ';
      conversions['Y'] = 'Ý|Ÿ|Ŷ';
      conversions['y'] = 'ý|ÿ|ŷ';
      conversions['W'] = 'Ŵ';
      conversions['w'] = 'ŵ';
      conversions['Z'] = 'Ź|Ż|Ž';
      conversions['z'] = 'ź|ż|ž';
      conversions['AE'] = 'Æ|Ǽ';
      conversions['ss'] = 'ß';
      conversions['IJ'] = 'Ĳ';
      conversions['ij'] = 'ĳ';
      conversions['OE'] = 'Œ';
      conversions['f'] = 'ƒ';

      for(var i in conversions){
          var re = new RegExp(conversions[i],"g");
          str = str.replace(re,i);
      }

      return str;
  }

    // submit() {

    //     if (this.zoneForm.valid) {
    //         this.zoneForm.value.codePlatform=this.zoneForm.controls.codePlatform.value;
    //         this.submitted.emit(this.zoneForm.value);
    //     }
    // }


    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getCsvZones() {
        return this.csvFile;
    }

    getCsvZonesUrl() {
        return this.docs_repo + this.csvFile;
    }

    cancel() {
        this.back.emit(this.platform.code);
    }
}