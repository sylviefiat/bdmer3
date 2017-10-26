import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../../modules/ngrx/index';

import { SpeciesAction } from '../../../modules/datas/actions/index';
import { Species, NameI18N } from '../../../modules/datas/models/species';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-species-form',
    templateUrl: 'species-form.component.html',
    styleUrls: [
        'species-form.component.css',
    ],
})
export class SpeciesFormComponent implements OnInit {
    //public species$: Observable<Species[]>;

    @Input() errorMessage: string | null;
    @Input() species: Species | null;


    @Output() submitted = new EventEmitter<Species>();

    form: FormGroup = new FormGroup({
        code: new FormControl(this.species && this.species.code, Validators.required),
        scientificName: new FormControl(this.species && this.species.scientificName, Validators.required),
        names: this._fb.array([]),
        LLW: this._fb.group({
            coefA: new FormControl(this.species && this.species && this.species.LLW.coefA),
            coefB: new FormControl(this.species && this.species.LLW.coefB),
        }),
        LW: this._fb.group({
            coefA: new FormControl(this.species && this.species.LW.coefA),
            coefB: new FormControl(this.species && this.species.LW.coefB),
        }),
        conversions: this._fb.group({
            salt: new FormControl(this.species && this.species.conversions.salt),
            BDM: new FormControl(this.species && this.species.conversions.BDM),
        }),
        biologicDimensions: this._fb.group({
            longMax: new FormControl(this.species && this.species.biologicDimensions.longMax),
            largMax: new FormControl(this.species && this.species.biologicDimensions.largMax),
        }),
        distribution: new FormControl(this.species && this.species.distribution),
        habitatPreference: new FormControl(this.species && this.species.habitatPreference),
        legalDimensions: this._fb.array([]),
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    initName() {
        if (this.species && this.species.names && this.species.names.length > 0) {
            const control = <FormArray>this.form.controls['names'];
            console.log(this.species.names.length);
            let addrCtrl;
            for (let name of this.species.names) {
                addrCtrl = this.newName(name.lang, name.name);
                control.push(addrCtrl);
            }
        } else {
            return this.addName();
        }
    }

    initLegalDim() {
        if (this.species && this.species.legalDimensions && this.species.legalDimensions.length > 0) {
            const control = <FormArray>this.form.controls['legalDimensions'];
            let addrCtrl;
            for (let dims of this.species.legalDimensions) {
                addrCtrl = this.newLegalDim(dims.codeCountry, dims.longMin, dims.longMax);
                control.push(addrCtrl);
            }
        } else {
            return this.addLegalDim();
        }
    }

    ngOnInit() {
        console.log(this.species);
        if (this.species) {
            this.form.controls.code.setValue(this.species.code);
            this.form.controls.scientificName.setValue(this.species.scientificName);

            this.form.patchValue({ LLW: { coefA: this.species.LLW.coefA } });
            this.form.patchValue({ LLW: { coefB: this.species.LLW.coefB } });

            this.form.patchValue({ LW: { coefA: this.species.LLW.coefA } });
            this.form.patchValue({ LW: { coefB: this.species.LLW.coefB } });

            this.form.patchValue({ conversions: { salt: this.species.conversions.salt } });
            this.form.patchValue({ conversions: { BDM: this.species.conversions.BDM } });

            this.form.patchValue({ biologicDimensions: { longMax: this.species.biologicDimensions.longMax } });
            this.form.patchValue({ biologicDimensions: { largMax: this.species.biologicDimensions.largMax } });

            this.form.controls.distribution.setValue(this.species.distribution);
            this.form.controls.habitatPreference.setValue(this.species.habitatPreference);
        }
        this.initName();
        this.initLegalDim();
    }

    newName(lang, name) {
        return this._fb.group({
            lang: new FormControl(lang),
            name: new FormControl(name)
        });
    }

    addName() {
        const control = <FormArray>this.form.controls['names'];
        const addrCtrl = this.newName('', '');

        control.push(addrCtrl);

        /* subscribe to individual address value changes */
        // addrCtrl.valueChanges.subscribe(x => {
        //   console.log(x);
        // })
    }

    removeName(i: number) {
        const control = <FormArray>this.form.controls['names'];
        control.removeAt(i);
    }

    newLegalDim(code, min, max) {
        return this._fb.group({
            codeCountry: new FormControl(code),
            longMin: new FormControl(min),
            longMax: new FormControl(max),
        });
    }

    addLegalDim() {
        const control = <FormArray>this.form.controls['legalDimensions'];
        const addrCtrl = this.newLegalDim('', '', '');

        control.push(addrCtrl);

        /* subscribe to individual address value changes */
        // addrCtrl.valueChanges.subscribe(x => {
        //   console.log(x);
        // })
    }

    removeLegalDim(i: number) {
        const control = <FormArray>this.form.controls['legalDimensions'];
        control.removeAt(i);
    }

    submit() {
        if (this.form.valid) {
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