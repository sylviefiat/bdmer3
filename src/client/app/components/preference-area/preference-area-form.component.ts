import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Site, Zone, ZonePreference } from '../../modules/datas/models/index';

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
    @Input() zonePrefForm: FormGroup;
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<ZonePreference>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    ngOnInit() {
        console.log(this.zonePref);
    }

    submit() {
        if (this.zonePrefForm.valid) {
            this.submitted.emit(this.zonePrefForm.value);
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