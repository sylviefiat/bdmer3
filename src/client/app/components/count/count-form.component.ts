import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Site, Zone, Transect, Count } from '../../modules/datas/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-count-form',
    templateUrl: 'count-form.component.html',
    styleUrls: [
        'count-form.component.css',
    ],
})
export class CountFormComponent implements OnInit {
    @Input() site: Site | null;
    @Input() zone: Zone | null;
    @Input() transect: Transect | null;
    @Input() count: Count | null;
    @Input() countForm: FormGroup;
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<Transect>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }


    ngOnInit() {
        console.log(this.count);
        
    }

    submit() {
        if (this.countForm.valid) {
            this.submitted.emit(this.countForm.value);
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