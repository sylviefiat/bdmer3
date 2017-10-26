import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../../modules/ngrx/index';

import { Site, Zone, Transect, ZonePreference, Count } from '../../../modules/datas/models/index';
import { Country } from '../../../modules/countries/models/country';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-site-form',
    templateUrl: 'site-form.component.html',
    styleUrls: [
        'site-form.component.css',
    ],
})
export class SiteFormComponent implements OnInit {
    
    @Input() errorMessage: string | null;
    @Input() site: Site | null;
    @Input() country: Country | null;

    @Output() submitted = new EventEmitter<Site>();

    form: FormGroup = new FormGroup({
        code: new FormControl(this.site && this.site.code, Validators.required),
        codeCountry: new FormControl(this.site && this.site.codeCountry),
        description: new FormControl(this.site && this.site.description),
        zones: this._fb.array([]),        
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    initZone() {
        if (this.site && this.site.zones && this.site.zones.length > 0) {
            const control = <FormArray>this.form.controls['zones'];
            console.log(this.site.zones.length);
            let addrCtrl;
            for (let zone of this.site.zones) {
                addrCtrl = this.newZone(zone);
                control.push(addrCtrl);
            }
        } /*else {
            return this.addZone();
        }*/
    }

    /*initTransect(zone: Zone) {
        if (zone && zone.transects && zone.transects.length > 0) {
            const control = <FormArray>this.form.controls['zones'].get .controls['transects'];
            console.log(zone.transects.length);
            let addrCtrl;
            for (let transect of zone.transects) {
                addrCtrl = this.newTransect(transect);
                control.push(addrCtrl);
            }
        } else {
            return this.addTransect();
        }
    }

    initZonePreference(zone: Zone) {
        if (zone && zone.zonePreference && zone.zonePreference.length > 0) {
            const control = <FormArray>this.form.controls['zones'].controls['zonePreferences'];
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
            const control = <FormArray>this.form.controls['counts'];
            console.log(transect.counts.length);
            let addrCtrl;
            for (let count of transect.counts) {
                addrCtrl = this.newCount(count);
                control.push(addrCtrl);
            }
        } else {
            return this.addZonePreference();
        }
    }*/

    ngOnInit() {
        console.log(this.country);
        if (this.site) {
            this.form.controls.code.setValue(this.site.code);
            this.form.controls.description.setValue(this.site.description);
            this.initZone();
        }
    }

    newZone(zone: Zone) {
        let zn = this._fb.group({
            code: new FormControl(zone && zone.code||''),
            surface: new FormControl(zone && zone.surface||''),
            transects: this._fb.array([]),
            zonePreference: this._fb.array([])
        });
        //this.initTransect(zone);
        //this.initZonePreference(zone);
        return zn;
    }

    addZone() {
        const control = <FormArray>this.form.controls['zones'];
        const addrCtrl = this.newZone(null);
        control.push(addrCtrl);
    }

    removeZone(i: number) {
        const control = <FormArray>this.form.controls['zones'];
        control.removeAt(i);
    }
/*
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
        const control = <FormArray>this.form.controls['zonePreferences'];
        const addrCtrl = this.newZonePreference(null);
        control.push(addrCtrl);
    }

    removeZonePreference(i: number) {
        const control = <FormArray>this.form.controls['zonePreferences'];
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
        const control = <FormArray>this.form.controls['transects'];
        const addrCtrl = this.newTransect(null);
        control.push(addrCtrl);
    }

    removeTransect(i: number) {
        const control = <FormArray>this.form.controls['transects'];
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
        const control = <FormArray>this.form.controls['counts'];
        const addrCtrl = this.newCount(null);
        control.push(addrCtrl);
    }

    removeCount(i: number) {
        const control = <FormArray>this.form.controls['counts'];
        control.removeAt(i);
    }
*/
    submit() {
        console.log(this.form);
        if (this.form.valid) {
            this.form.controls.codeCountry.setValue(this.country.code);
            this.submitted.emit(this.form.value);
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