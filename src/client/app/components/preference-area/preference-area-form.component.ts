import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Platform, Zone, ZonePreference, Species } from '../../modules/datas/models/index';

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
    @Input() platform: Platform | null;
    @Input() zone: Zone | null;
    @Input() zonePref: ZonePreference | null;
    @Input() species: Species[];
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<ZonePreference>();

    zonePrefForm: FormGroup = new FormGroup({
        code: new FormControl("", Validators.required),
        codePlatform: new FormControl(""),
        codeZone: new FormControl(""),
        codeSpecies: new FormControl(),
        presence: new FormControl(),
        infoSource: new FormControl("")
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    ngOnInit() {
        console.log(this.zonePref);
        this.zonePrefForm.controls.codePlatform.setValue(this.platform ? this.platform.code : null);
        this.zonePrefForm.controls.codeZone.setValue(this.zone ? this.zone.properties.code : null);
        (this.platform !== undefined) ? this.zonePrefForm.controls.codePlatform.disable() : this.zonePrefForm.controls.codePlatform.enable();
        (this.zone !== undefined) ? this.zonePrefForm.controls.codeZone.disable() : this.zonePrefForm.controls.codeZone.enable();
        if(this.zonePref){
            this.zonePrefForm.controls.code.setValue(this.zonePref.code);
            this.zonePrefForm.controls.codeSpecies.setValue(this.zonePref.codeSpecies);
            this.zonePrefForm.controls.presence.setValue(this.zonePref.presence);
            this.zonePrefForm.controls.infoSource.setValue(this.zonePref.infoSource);            
        } else {
            this.zonePrefForm.controls.code.setValue(this.zone.properties.code+"_");
        }
    }

    submit() {
        if (this.zonePrefForm.valid) {
            this.zonePrefForm.value.codePlatform=this.zonePrefForm.controls.codePlatform.value;
            this.zonePrefForm.value.codeZone=this.zonePrefForm.controls.codeZone.value;
            this.submitted.emit(this.zonePrefForm.value);
        }
    }

    get isNewForm(){
        return !this.zonePref;
    }

    selectSpecies(species: Species){
        this.zonePrefForm.controls.codeSpecies.setValue(species.code);
    }

    isSelected(code: string){
        return code === this.zonePref.codeSpecies;
    }

    selectPresence(presence: string){
        this.zonePrefForm.controls.presence.setValue(presence);
    }

    return() {
        let redirect = this.zonePref ? 'zonePref/'+this.platform.code+'/'+this.zone.properties.code+'/'+this.zonePref.code : '/zone/' + this.platform.code + "/" + this.zone.properties.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}