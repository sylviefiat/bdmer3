import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../../modules/ngrx/index';

import { Site, Zone, Transect, ZonePreference, Count } from '../../../modules/datas/models/index';

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
    @Input() site: Site | null;
    @Input() zone: Zone | null;
    @Input() zoneForm: FormGroup;
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<Zone>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    initTransect() {
        console.log(this.zone);
        if (this.zone && this.zone.transects && this.zone.transects.length > 0) {
            const control = <FormArray>this.zoneForm.controls['transects'];
            console.log(this.zone.transects.length);
            let addrCtrl;
            for (let transect of this.zone.transects) {
                addrCtrl = this.newTransect(transect);
                control.push(addrCtrl);
            }
        } 
    }

    initZonePreference() {
        if (this.zone && this.zone.zonePreferences && this.zone.zonePreferences.length > 0) {
            const control = <FormArray>this.zoneForm.controls['zonePreferences'];
            console.log(this.zone.zonePreferences.length);
            let addrCtrl;
            for (let zp of this.zone.zonePreferences) {
                addrCtrl = this.newZonePreference(zp);
                control.push(addrCtrl);
            }
        } 
    }

    ngOnInit() {
        console.log(this.zoneForm);
        console.log(this.zone);
        console.log(this.site);
        this.initTransect();
        this.initZonePreference();
    }

    newZonePreference(zonePreference: ZonePreference) {
        let zp = this._fb.group({
            code: new FormControl(zonePreference && zonePreference.code || ""),
            codeSpecies: new FormControl(zonePreference && zonePreference.codeSpecies || ''),
            presence: new FormControl(zonePreference && zonePreference.presence || ''),
            infoSource: new FormControl(zonePreference && zonePreference.infoSource || ''),
        });
        return zp;
    }

    addZonePreference() {
        const control = <FormArray>this.zoneForm.controls['zonePreferences'];
        const addrCtrl = this.newZonePreference(null);
        control.push(addrCtrl);
    }

    removeZonePreference(i: number) {
        const control = <FormArray>this.zoneForm.controls['zonePreferences'];
        control.removeAt(i);
    }

    newTransect(transect: Transect) {
        console.log(this.zone);
        let tr = this._fb.group({
            code: new FormControl(transect && transect.code || this.zone && this.zone.code && this.zone.code+"_T" || ''),
            longitude: new FormControl(transect && transect.longitude || ''),
            latitude: new FormControl(transect && transect.latitude || ''),
            counts: this._fb.array([])
        });
        return tr;
    }

    addTransect() {
        const control = <FormArray>this.zoneForm.controls['transects'];
        const addrCtrl = this.newTransect(null);
        control.push(addrCtrl);
    }

    removeTransect(i: number) {
        const control = <FormArray>this.zoneForm.controls['transects'];
        control.removeAt(i);
    }

    submit() {
        if (this.zoneForm.valid) {
            this.submitted.emit(this.zoneForm.value);
        }
    }

    return() {
        this.routerext.navigate(['/site/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}