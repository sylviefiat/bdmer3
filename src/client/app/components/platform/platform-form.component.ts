import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Platform, Zone, Transect, ZonePreference, Count } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-platform-form',
    templateUrl: 'platform-form.component.html',
    styleUrls: [
        'platform-form.component.css',
    ],
})
export class PlatformFormComponent implements OnInit {

    @Input() errorMessage: string | null;
    @Input() platform: Platform | null;
    @Input() country: Country | null;
    @Input() countries: Country[];
    @Input() isAdmin: boolean;
    @Output() submitted = new EventEmitter<Platform>();

    form: FormGroup = new FormGroup({
        code: new FormControl("", Validators.required),
        codeCountry: new FormControl(""),
        description: new FormControl("")
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }


    ngOnInit() {
        this.form.controls.codeCountry.setValue(this.country ? this.country.code : null);
        (this.country !== undefined)?this.form.controls.codeCountry.disable():this.form.controls.codeCountry.enable();
        if (this.platform) {
            this.form.controls.code.setValue(this.platform.code);            
            this.form.controls.description.setValue(this.platform.description);
            console.log(this.form.controls.codeCountry);
        }
    }

    setCountry(country: Country){
        this.form.controls.codeCountry.setValue(country.code);
    }

    submit() {
        if (this.form.valid) {
            this.submitted.emit(this.form.value);
        }
    }

    return() {
        this.routerext.navigate(['/platform/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}