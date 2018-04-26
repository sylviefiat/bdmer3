import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import * as area from '@mapbox/geojson-area';

import { IAppState } from '../../modules/ngrx/index';
import { NameRefactorService } from '../../modules/core/services/nameRefactor.service';
import { Platform, Zone } from '../../modules/datas/models/index';
import { PlatformAction } from '../../modules/datas/actions/index';

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
    @Input() errorMessage: boolean;

    @Output() submitted = new EventEmitter<Zone>();

    code: string;

    zoneForm: FormGroup = new FormGroup({
        type: new FormControl("Feature"),
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

    constructor(private nameRefactorService: NameRefactorService, private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    ngOnInit() {
        this.zoneForm.controls.codePlatform.setValue(this.platform ? this.platform.code : null);
        if(this.zone){
            this.zoneForm.controls.properties.get("name").setValue(this.zone.properties.name) 
            let string = '';
            let coordAr = this.zone.geometry["coordinates"]["0"];
            for(let i = 0; i < coordAr.length; i++){
                string += (coordAr[i]["0"].toString() + "," + coordAr[i]["1"].toString() + "," + coordAr[i]["2"].toString() + " ");
            }
            this.zoneForm.controls.geometry.get("coordinates").setValue(string);
            this.zoneForm.controls.properties.get("name").disable();

        }
    }

    submit() {
        this.errorMessage = false;

        this.zoneForm.controls.properties.get("surface").setValue(parseInt(this.zoneForm.controls.properties.get("surface").value));
        this.zoneForm.controls.properties.get("code").setValue(this.platform.code + "_" +this.nameRefactorService.convertAccent(this.zoneForm.controls.properties.get("name").value).split(' ').join('-').replace(/[^a-zA-Z0-9]/g,''));

        this.refactorCoordinates();
        this.setSurface();
        if (this.zoneForm.valid) {
            if(this.zoneForm.controls.properties.get("surface").value === 0){
                this.errorMessage = true;
            }else{
                this.zoneForm.controls.properties.get("name").enable();
                this.submitted.emit(this.zoneForm.value);
            }
        }
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

    setSurface(){
        const surface = area.geometry(this.zoneForm.controls.geometry.value);
        this.zoneForm.controls.properties.get("surface").setValue(parseInt(surface.toString().split('.')['0']));
    }

    refactorCoordinates(){
        const string = this.zoneForm.controls.geometry.get("coordinates").value.split(' ');
        const a = string.length; 
        let ar = [];
        for (let i = 0; i < a; i++) {
            let tempo = string[i].split(',')
            for(let j = 0; j < tempo.length; j++){
                tempo[j] = parseFloat(tempo[j])
            }
            ar.push(tempo)
        }
        let res = [];
        res.push(ar)
        this.zoneForm.controls.geometry.get("coordinates").setValue(res);
    }
}