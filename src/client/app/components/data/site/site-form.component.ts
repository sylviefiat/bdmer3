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
        }
    }

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
            code: new FormControl(zone && zone.code || this.site && this.site.code && this.site.code+'_Z' || ''),
            surface: new FormControl(zone && zone.surface||''),
            transects: this._fb.array([]),
            zonePreferences: this._fb.array([])
        });        
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

    submit() {
        console.log(this.form);
        if (this.form.valid) {
            this.submitted.emit(this.form.value);
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