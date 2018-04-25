import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import { MapStaticService} from '../../modules/core/services/map-static.service';

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

    url: string;
    code: string;
    coords: string;
    coordsRefactor: any;
    coordStringRefactor: string = '';
    errorCoord: boolean;

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

    constructor(private mapStaticService: MapStaticService, private nameRefactorService: NameRefactorService, private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }


    ngOnInit() {
        this.zoneForm.controls.codePlatform.setValue(this.platform ? this.platform.code : null);
        if(this.zone){
            this.zoneForm.controls.properties.get("name").setValue(this.zone.properties.name) 
            let coordAr = this.zone.geometry["coordinates"]["0"];
            for(let i = 0; i < coordAr.length; i++){
                this.coordStringRefactor += (coordAr[i]["0"].toString() + "," + coordAr[i]["1"].toString() + "," + coordAr[i]["2"].toString() + " ");
            }
            this.zoneForm.controls.geometry.get("coordinates").setValue(this.coordStringRefactor);
            this.zoneForm.controls.properties.get("name").disable();
        }
    }

    submit() {
        this.zoneForm.controls.properties.get("surface").setValue(parseInt(this.zoneForm.controls.properties.get("surface").value));
        this.zoneForm.controls.properties.get("code").setValue(this.platform.code + "_" +this.convertName(this.zoneForm.controls.properties.get("name").value).split(' ').join('-').replace(/[^a-zA-Z0-9]/g,''));

            this.mapStaticService.staticMapToB64(this.url).then((data) => {
              this.zoneForm.controls.staticmap.setValue(data);


              if(this.coordStringRefactor === this.zoneForm.controls.geometry.get("coordinates").value){
                this.zoneForm.controls.geometry.get("coordinates").setValue(this.zone.geometry["coordinates"])
                this.zoneForm.controls.properties.get("surface").setValue(this.zone.properties["surface"])
              }else{
                    this.zoneForm.controls.geometry.get("coordinates").setValue(this.coordsRefactor);
                this.zoneForm.controls.properties.get("surface").setValue(this.mapStaticService.setSurface(this.zoneForm.controls.geometry.value));
              }

              if (this.zoneForm.valid) {
                if(this.zoneForm.controls.properties.get("surface").value === 0){
                    this.zoneForm.controls.geometry.get("coordinates").setValue(this.coords);
                    this.errorMessage = true
                }else{
                    this.zoneForm.controls.properties.get("name").enable();
                    this.submitted.emit(this.zoneForm.value);
                }
              }
            });
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

    coordChange(coords){
        this.errorCoord = false;
        var ar = this.mapStaticService.refactorCoordinates(coords.target.value);
        if(ar !== "error"){
            this.url = this.mapStaticService.googleMapUrl(ar);
            this.coordsRefactor = ar;
        }else{
            this.errorCoord = true;
        }
    }
}