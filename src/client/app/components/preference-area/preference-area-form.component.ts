import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Site, Zone, ZonePreference, Species } from '../../modules/datas/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-zone-pref-form',
    templateUrl: 'preference-area-form.component.html',
    styleUrls: [
        'preference-area-form.component.css',
    ],
})
export class PreferenceAreaFormComponent implements OnInit {
    @Input() site: Site | null;
    @Input() zone: Zone | null;
    @Input() zonePref: ZonePreference | null;
    @Input() species: Species[];
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<ZonePreference>();

    zonePrefForm: FormGroup = new FormGroup({
        code: new FormControl("", Validators.required),
        codeSite: new FormControl(""),
        codeZone: new FormControl(""),
        codeSpecies: new FormControl(""),
        presence: new FormControl(""),
        infoSource: new FormControl("")
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    ngOnInit() {
        console.log(this.zonePref);
        this.zonePrefForm.controls.codeSite.setValue(this.site ? this.site.code : null);
        this.zonePrefForm.controls.codeZone.setValue(this.zone ? this.zone.code : null);
        (this.site !== undefined) ? this.zonePrefForm.controls.codeSite.disable() : this.zonePrefForm.controls.codeSite.enable();
        (this.zone !== undefined) ? this.zonePrefForm.controls.codeZone.disable() : this.zonePrefForm.controls.codeZone.enable();
        if(this.zonePref){
            this.zonePrefForm.controls.code.setValue(this.zonePref.code);
            this.zonePrefForm.controls.codeSpecies.setValue(this.zonePref.codeSpecies);
            this.zonePrefForm.controls.presence.setValue(this.zonePref.presence);
            this.zonePrefForm.controls.infoSource.setValue(this.zonePref.infoSource);            
        } else {
            this.zonePrefForm.controls.code.setValue(this.zone.code+"_PA");
        }
    }

    submit() {
        if (this.zonePrefForm.valid) {
            this.submitted.emit(this.zonePrefForm.value);
        }
    }

    return() {
        let redirect = this.zonePref ? 'zonePref/'+this.site.code+'/'+this.zone.code+'/'+this.zonePref.code : '/zone/' + this.site.code + "/" + this.zone.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}