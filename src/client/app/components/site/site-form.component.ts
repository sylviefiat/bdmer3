import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Site, Zone, Transect, ZonePreference, Count } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

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
    @Input() countries: Country[];
    @Input() isAdmin: boolean;
    @Output() submitted = new EventEmitter<Site>();

    form: FormGroup = new FormGroup({
        code: new FormControl(this.site && this.site.code, Validators.required),
        codeCountry: new FormControl({ value: this.country && this.country.code, disabled: this.country !== undefined }),
        description: new FormControl(this.site && this.site.description),
        zones: this._fb.array([]),
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }


    ngOnInit() {
        if (this.site) {
            this.form.controls.code.setValue(this.site.code);
            this.form.controls.codeCountry.setValue({ value: this.country ? this.country.code : null, disabled: this.country !== undefined });
            this.form.controls.description.setValue(this.site.description);
        }
    }

    setCountry(country: Country){
        this.form.controls.codeCountry.setValue(country.code);
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