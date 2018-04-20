import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import * as area from '@mapbox/geojson-area';

import { IAppState } from '../../modules/ngrx/index';

import { Platform, Zone } from '../../modules/datas/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-zone-form',
    templateUrl: 'zone-form.component.html',
    styleUrls: [
        'zone-form.component.css',
    ],
})
export class ZoneFormComponent implements OnInit {
    @Input() platform: Platform;
    @Input() zone: Zone | null;
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<Zone>();

    code: string;

    zoneForm: FormGroup = new FormGroup({
        type: new FormControl("Feature"),
        staticmap: new FormControl(""),
        geometry: new FormGroup({
            type: new FormControl("Polygon"),
            coordinates: new FormControl(),
        }),
        properties: new FormGroup({
            name: new FormControl(""),
            code: new FormControl(""),
            surface: new FormControl(),
        }),
        codePlatform: new FormControl(""),
        transects: new FormArray([]),
        zonePreferences: new FormArray([])
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    ngOnInit() {
        this.zoneForm.controls.codePlatform.setValue(this.platform ? this.platform.code : null);
    }

    submit() {

        this.zoneForm.controls.properties.get("surface").setValue(parseInt(this.zoneForm.controls.properties.get("surface").value));
        this.zoneForm.controls.properties.get("code").setValue(this.platform.code + "_" +this.convertName(this.zoneForm.controls.properties.get("name").value).split(' ').join('-').replace(/[^a-zA-Z0-9]/g,''));

        this.setStaticMap().then((data) => {
          this.zoneForm.controls.staticmap.setValue(data);
          this.refactorCoordinates();
          this.setSurface();
          if (this.zoneForm.valid) {
              this.submitted.emit(this.zoneForm.value);
          }
        });
        
    }

    return() {
        let redirect = this.zone ? '/zone/' + this.platform.code + "/" + this.zone.properties.code : '/platform' + this.platform.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

    setStaticMap(){
      return new Promise((resolve, reject) => {
        var string = this.zoneForm.controls.geometry.get("coordinates").value.split(' ');
        var a = string.length; 
        var ar = [];
        for (var i = 0; i < a; i++) {
            var tempo = string[i].split(',')

            for(var j = 0; j < tempo.length; j++){
                tempo[j] = parseFloat(tempo[j])
            }
            tempo.splice(2, 1)
            ar.push(tempo)
        }

        var url = "https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff%7Cweight:5%7C";

        for(var i=0; i<ar.length; i++){
          url += ar[i][1] + "," + ar[i][0]; 
          if(i !== ar.length - 1){
            url+="|"
          }
        }

        url += "&size=700x700&zoom=9&key=AIzaSyCOm1K8tIc7J9GpKEjCKp4VnCwVukqic2g"

        var img = new Image();
        img.src = url;

        var xhr = new XMLHttpRequest();
        var self= this;
        xhr.onload = function() {
          var reader = new FileReader();
          reader.onloadend = function() {
            resolve(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
       });
    }

    setSurface(){
        var surface = area.geometry(this.zoneForm.controls.geometry.value);
        this.zoneForm.controls.properties.get("surface").setValue(parseInt(surface.toString().split('.')['0']));
    }

    refactorCoordinates(){
        var string = this.zoneForm.controls.geometry.get("coordinates").value.split(' ');
        var a = string.length; 
        var ar = [];
        for (var i = 0; i < a; i++) {
            var tempo = string[i].split(',')
            for(var j = 0; j < tempo.length; j++){
                tempo[j] = parseFloat(tempo[j])
            }
            ar.push(tempo)
        }
        var res = [];
        res.push(ar)
        this.zoneForm.controls.geometry.get("coordinates").setValue(res);
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

}