import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Site, Zone, Transect, ZonePreference, Count } from '../../modules/datas/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-transect-form',
    templateUrl: 'transect-form.component.html',
    styleUrls: [
        'transect-form.component.css',
    ],
})
export class TransectFormComponent implements OnInit {
    @Input() site: Site | null;
    @Input() zone: Zone | null;
    @Input() transect: Transect | null;
    @Input() transectForm: FormGroup;
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<Transect>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    initCount() {
        if (this.transect && this.transect.counts && this.transect.counts.length > 0) {
            const control = <FormArray>this.transectForm.controls['counts'];
            console.log(this.transect.counts.length);
            let addrCtrl;
            for (let c of this.transect.counts) {
                addrCtrl = this.newCount(c);
                control.push(addrCtrl);
            }
        }
    }

    ngOnInit() {
        console.log(this.transect);
        this.initCount();
    }

    newCount(count: Count) {
        let ct = this._fb.group({
            code: new FormControl("", Validators.required),
            codeCampagne: new FormControl(""),
            codeSite: new FormControl(""),
            codeZone: new FormControl(""),
            nomTransect: new FormControl(""),
            codeTransect: new FormControl(""),
            date: new FormControl(""),
            codeSpecies: new FormControl(""),
            mesures: new FormControl("")
        });
        return ct;
    }

    addCount() {
        const control = <FormArray>this.transectForm.controls['counts'];
        const addrCtrl = this.newCount(null);
        control.push(addrCtrl);
    }

    removeCount(i: number) {
        const control = <FormArray>this.transectForm.controls['counts'];
        control.removeAt(i);
    }

    submit() {
        if (this.transectForm.valid) {
            this.submitted.emit(this.transectForm.value);
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