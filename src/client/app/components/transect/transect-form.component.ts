import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';
import { MapStaticService} from '../../modules/core/services/map-static.service';
import { NameRefactorService } from '../../modules/core/services/nameRefactor.service';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Platform, Zone, Transect, ZonePreference, Count } from '../../modules/datas/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-transect-form',
    templateUrl: 'transect-form.component.html',
    styleUrls: [
    'transect-form.component.css',
    ],
})
export class TransectFormComponent implements OnInit {
    @Input() platform: Platform | null;
    @Input() zone: Zone | null;
    @Input() transect: Transect | null;
    @Input() errorMessage: boolean;

    @Output() submitted = new EventEmitter<Transect>();

    url: string;
    code: string;
    longitude: any;
    latitude: any;
    errorLat: boolean;
    errorLng: boolean;
    canSubmit: boolean;

    transectForm: FormGroup = new FormGroup({
        type: new FormControl("Feature"),
        geometry: new FormGroup({
            type: new FormControl("Point"),
            coordinates: new FormControl(),
        }),
        properties: new FormGroup({
            name: new FormControl(""),
            code: new FormControl("")
        }),
        staticMapTransect: new FormControl(""),
        codeZone: new FormControl(""),
        codePlatform: new FormControl(""),
    });

    constructor(private nameRefactorService: NameRefactorService, private mapStaticService: MapStaticService, private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }
    
    ngOnInit() {
        this.transectForm.controls.codePlatform.setValue(this.platform ? this.platform.code : null);
        this.transectForm.controls.codeZone.setValue(this.zone ? this.zone.properties.code : null);
        this.zone ? this.zone: null;

        if(this.transect){
            this.transectForm.controls.properties.get("name").setValue(this.transect.properties.name);
            this.transectForm.controls.properties.get("code").setValue(this.transect.properties.code);
            this.url = this.transect.staticMapTransect;
            this.longitude = this.transect.geometry["coordinates"]["0"];
            this.latitude = this.transect.geometry["coordinates"]["1"]
            this.transectForm.controls.properties.get("name").disable();
        }
    }

    submit() {
        if(!this.errorLat && !this.errorLng){

            this.transectForm.controls.properties.get("code").setValue(this.zone.properties.code + "_" +this.nameRefactorService.convertAccent(this.transectForm.controls.properties.get("name").value).split(' ').join('-').replace(/[^a-zA-Z0-9]/g,''));
            this.transectForm.controls.geometry.get("coordinates").setValue([this.longitude, this.latitude])

            this.mapStaticService.staticMapToB64(this.url).then((data) => {
                this.transectForm.controls.staticMapTransect.setValue(data);

                if (this.transectForm.valid) {
                    this.transectForm.controls.properties.get("name").enable();
                    this.submitted.emit(this.transectForm.value);
                }
            });
        }
    }

    return() {
        let redirect = this.transect ? 'transect/'+this.platform.code+'/'+this.zone.properties.code+'/'+this.transect.properties.code : '/zone/' + this.platform.code + "/" + this.zone.properties.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

    coordChange(){
        this.errorLat = false; 
        this.errorLng = false;

        if(this.latitude){
            this.errorLat = !this.mapStaticService.checkIsValidCoordinate(this.latitude, 'lat');
        }

        if(this.longitude){
            this.errorLng = !this.mapStaticService.checkIsValidCoordinate(this.longitude, 'lng');
        }

        if(!this.errorLat && !this.errorLng && this.latitude && this.longitude){
            this.url = this.mapStaticService.googleMapUrlPoint([this.longitude, this.latitude]);
            this.canSubmit = true;
        }else{
            this.url = ""
            this.canSubmit = false;
        }
    }

}