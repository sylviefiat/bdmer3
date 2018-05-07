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
    coords: string;
    coordsRefactor: any;
    coordStringRefactor: string = '';
    errorCoord: boolean;

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

        if(this.transect){
            this.transectForm.controls.properties.get("name").setValue(this.transect.properties.name);
            this.transectForm.controls.properties.get("code").setValue(this.transect.properties.code);
            this.url = this.transect.staticMapTransect;
            this.transectForm.controls.geometry.get("coordinates").setValue(this.transect.geometry["coordinates"]["0"].toString() + "," + this.transect.geometry["coordinates"]["1"].toString()); 
            this.transectForm.controls.properties.get("name").disable();
        }
    }

    submit() {
        if(!this.errorCoord){
            this.errorMessage = false;
            
            this.transectForm.controls.properties.get("code").setValue(this.zone.properties.code + "_" +this.nameRefactorService.convertAccent(this.transectForm.controls.properties.get("name").value).split(' ').join('-').replace(/[^a-zA-Z0-9]/g,''));
            this.coords = this.transectForm.controls.geometry.get("coordinates").value;

            this.mapStaticService.staticMapToB64(this.url).then((data) => {
                this.transectForm.controls.staticMapTransect.setValue(data);

                if(this.coordStringRefactor === this.transectForm.controls.geometry.get("coordinates").value){
                    this.transectForm.controls.geometry.get("coordinates").setValue(this.transect.geometry["coordinates"])
                }else{
                    this.transectForm.controls.geometry.get("coordinates").setValue(this.coordsRefactor);
                }

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

    coordChange(coords){
        this.errorCoord = false;
        var ar = this.mapStaticService.refactorCoordinatesPoint(coords.target.value);

        console.log(ar)
        if(ar !== "error"){
            this.url = this.mapStaticService.googleMapUrlPoint(ar);
            this.coordsRefactor = ar;
        }else{
            this.errorCoord = true;
            this.url = ""
        }
    }

}