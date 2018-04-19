import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { Platform, Zone } from '../../modules/datas/models/index';

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
    @Input() platform: Platform;
    @Input() zone: Zone | null;
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<Zone>();

    code: string;

    zoneForm: FormGroup = new FormGroup({
        code: new FormControl("", Validators.required),
        codePlatform: new FormControl(""),
        surface: new FormControl(""),
        geojson: new FormGroup({
            type: new FormControl("Zone"),
            geometry: new FormGroup({
                type: new FormControl("Polygon"),
                coordinates: new FormControl("",Validators.required)
            }),
        }),
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    ngOnInit() {
        console.log(this.platform)
        this.zoneForm.controls.codePlatform.setValue(this.platform ? this.platform.code : null);
        (this.platform !== undefined) ? this.zoneForm.controls.codePlatform.disable() : this.zoneForm.controls.codePlatform.enable();
        if (this.zone) {
            this.zoneForm.controls.code.setValue(this.zone.code);
            this.zoneForm.controls.surface.setValue(this.zone.surface);
        } else {
            this.zoneForm.controls.code.setValue(this.platform.code+"_Z");
        }
    }

    submit() {

        if (this.zoneForm.valid) {
            this.zoneForm.value.codePlatform=this.zoneForm.controls.codePlatform.value;
            this.submitted.emit(this.zoneForm.value);
        }
    }

    return() {
        let redirect = this.zone ? '/zone/' + this.platform.code + "/" + this.zone.code : '/platform' + this.platform.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}