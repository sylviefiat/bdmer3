import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Site, Zone, Transect, ZonePreference, Count } from '../../modules/datas/models/index';

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
    @Input() site: Site | null;
    @Input() zone: Zone | null;
    @Input() transect: Transect | null;
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<Transect>();

    transectForm: FormGroup = new FormGroup({
        code: new FormControl("", Validators.required),
        codeSite: new FormControl(""),
        codeZone: new FormControl(""),
        latitude: new FormControl(""),
        longitude: new FormControl("")
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }
    
    ngOnInit() {
        this.transectForm.controls.codeSite.setValue(this.site ? this.site.code : null);
        this.transectForm.controls.codeZone.setValue(this.zone ? this.zone.code : null);
        (this.site !== undefined) ? this.transectForm.controls.codeSite.disable() : this.transectForm.controls.codeSite.enable();
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
            this.transectForm.value.codeSite=this.transectForm.controls.codeSite.value;
            this.transectForm.value.codeZone=this.transectForm.controls.codeZone.value;
            this.submitted.emit(this.transectForm.value);
        }
    }

    return() {
        let redirect = this.transect ? 'transect/'+this.site.code+'/'+this.zone.code+'/'+this.transect.code : '/zone/' + this.site.code + "/" + this.zone.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}