import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { Site, Zone } from '../../modules/datas/models/index';

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
    @Input() site: Site;
    @Input() zone: Zone | null;
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<Zone>();

    zoneForm: FormGroup = new FormGroup({
        code: new FormControl("", Validators.required),
        codeSite: new FormControl(""),
        surface: new FormControl("")
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    ngOnInit() {
        this.zoneForm.controls.codeSite.setValue(this.site ? this.site.code : null);
        (this.site !== undefined) ? this.zoneForm.controls.codeSite.disable() : this.zoneForm.controls.codeSite.enable();
        if (this.zone) {
            this.zoneForm.controls.code.setValue(this.zone.code);
            this.zoneForm.controls.surface.setValue(this.zone.surface);
        } else {
            this.zoneForm.controls.code.setValue(this.site.code+"_Z");
        }
    }

    submit() {
        if (this.zoneForm.valid) {
            this.submitted.emit(this.zoneForm.value);
        }
    }

    return() {
        let redirect = this.zone ? '/zone/' + this.site.code + "/" + this.zone.code : '/site' + this.site.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}