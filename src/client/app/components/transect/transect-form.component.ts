import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

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
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<Transect>();

    transectForm: FormGroup = new FormGroup({
        code: new FormControl("", Validators.required),
        codePlatform: new FormControl(""),
        codeZone: new FormControl(""),
        latitude: new FormControl(""),
        longitude: new FormControl("")
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }
    
    ngOnInit() {
        this.transectForm.controls.codePlatform.setValue(this.platform ? this.platform.code : null);
        this.transectForm.controls.codeZone.setValue(this.zone ? this.zone.code : null);
        (this.platform !== undefined) ? this.transectForm.controls.codePlatform.disable() : this.transectForm.controls.codePlatform.enable();
        (this.zone !== undefined) ? this.transectForm.controls.codeZone.disable() : this.transectForm.controls.codeZone.enable();
        if(this.transect) {
            this.transectForm.controls.code.setValue(this.transect.code);
            this.transectForm.controls.latitude.setValue(this.transect.latitude);
            this.transectForm.controls.longitude.setValue(this.transect.longitude);
        } else {
            this.transectForm.controls.code.setValue(this.zone.code + "_T");
        }
    }

    submit() {
        console.log(this.transectForm);
        if (this.transectForm.valid) {
            this.transectForm.value.codePlatform=this.transectForm.controls.codePlatform.value;
            this.transectForm.value.codeZone=this.transectForm.controls.codeZone.value;
            this.submitted.emit(this.transectForm.value);
        }
    }

    return() {
        let redirect = this.transect ? 'transect/'+this.platform.code+'/'+this.zone.code+'/'+this.transect.code : '/zone/' + this.platform.code + "/" + this.zone.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}