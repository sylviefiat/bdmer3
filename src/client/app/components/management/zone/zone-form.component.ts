import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../../modules/ngrx/index';

import { Zone, Transect, ZonePreference, Count } from '../../../modules/datas/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-zone-form',
    templateUrl: 'zone-form.component.html',
    styleUrls: [
        'zone.component.css',
    ],
})
export class ZoneFormComponent implements OnInit {
    
    @Input() errorMessage: string | null;
    @Input() zone: Zone | null;


    @Output() submitted = new EventEmitter<Zone>();

    zoneForm: FormGroup = new FormGroup({
        code: new FormControl(this.zone && this.zone.code, Validators.required),
        surface: new FormControl(this.zone && this.zone.surface),
        transects: this._fb.array([]),   
        zonePreference: this._fb.array([]),      
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    initTransect() {
        if (this.zone && this.zone.transects && this.zone.transects.length > 0) {
            const control = <FormArray>this.zoneForm.controls['transects'];
            console.log(this.zone.transects.length);
            let addrCtrl;
            for (let transect of this.zone.transects) {
                addrCtrl = this.newTransect(transect);
                control.push(addrCtrl);
            }
        } else {
            return this.addTransect();
        }
    }

    initZonePreference(zone: Zone) {
        if (zone && zone.zonePreference && zone.zonePreference.length > 0) {
            const control = <FormArray>this.zoneForm.controls['zonePreferences'];
            console.log(zone.zonePreference.length);
            let addrCtrl;
            for (let zp of zone.zonePreference) {
                addrCtrl = this.newZonePreference(zp);
                control.push(addrCtrl);
            }
        } else {
            return this.addZonePreference();
        }
    }

    initCounts(transect: Transect) {
        if (transect && transect.counts && transect.counts.length > 0) {
            const control = <FormArray>this.zoneForm.controls['counts'];
            console.log(transect.counts.length);
            let addrCtrl;
            for (let count of transect.counts) {
                addrCtrl = this.newCount(count);
                control.push(addrCtrl);
            }
        } else {
            return this.addZonePreference();
        }
    }

    ngOnInit() {
        console.log(this.zone);
        if (this.zone) {
            this.zoneForm.controls.code.setValue(this.zone.code);
            this.zoneForm.controls.surface.setValue(this.zone.surface);
        }
        this.initTransect();
    }

    newZonePreference(zonePreference: ZonePreference) {
        let zp = this._fb.group({
            code: new FormControl(zonePreference && zonePreference.code||''),
            codeSpecies: new FormControl(zonePreference && zonePreference.codeSpecies||''),
            presence: new FormControl(zonePreference && zonePreference.presence||''),
            infoSource: new FormControl(zonePreference && zonePreference.infoSource||''),            
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
        let tr = this._fb.group({
            code: new FormControl(transect && transect.code||''),
            name: new FormControl(transect && transect.name||''),
            longitude: new FormControl(transect && transect.longitude||''),
            latitude: new FormControl(transect && transect.latitude||''),
            counts: this._fb.array([])
        });
        this.initCounts(transect);
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

    newCount(count: Count) {
        let ct = this._fb.group({
            date: new FormControl(count && count.date||''),
            codeSpecies: new FormControl(count && count.codeSpecies||''),
            lonMm: new FormControl(count && count.longMm||''),
            largMm: new FormControl(count && count.largMm||''),
        });
        return ct;
    }

    addCount() {
        const control = <FormArray>this.zoneForm.controls['counts'];
        const addrCtrl = this.newCount(null);
        control.push(addrCtrl);
    }

    removeCount(i: number) {
        const control = <FormArray>this.zoneForm.controls['counts'];
        control.removeAt(i);
    }

    submit() {
        if (this.zoneForm.valid) {
            this.submitted.emit(this.zoneForm.value);
        }
    }

    return() {
        this.routerext.navigate(['/management/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}