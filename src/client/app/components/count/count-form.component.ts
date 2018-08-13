import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Platform, Zone, Station, Survey, Count, Species } from '../../modules/datas/models/index';

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
    @Input() platform: Platform | null;
    @Input() station: Station | null;
    @Input() survey: Survey | null;
    @Input() count: Count | null;
    @Input() errorMessage: string;
    @Input() countriesCount: string[];
    @Input() species: Species[];
    @Input() zones: Zone[];
    @Input() stations$: Observable<Station[]>;

    @Output() submitted = new EventEmitter<Survey>();

    noMesures: boolean = false;
    type: string = "count";

    countForm: FormGroup = new FormGroup({
        code: new FormControl("", Validators.required),
        codeSurvey: new FormControl(),
        codePlatform: new FormControl(""),
        codeStation: new FormControl(),
        date: new FormControl(""),
        monospecies: new FormControl(),
        mesures: this._fb.array([]),
        count: new FormGroup({
          codeSpecies: new FormControl(),
          quantity: new FormControl()
        })
    });
    monospecies: boolean = false;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }

    initMesures() {
        if (this.count && this.count.mesures && this.count.mesures.length > 0) {
            const control = <FormArray>this.countForm.controls['mesures'];
            let addrCtrl;
            for (let mes of this.count.mesures) {
                addrCtrl = this.newMesure(mes.codeSpecies, mes.long, mes.larg);
                control.push(addrCtrl);
            }
        }
    }

    ngOnInit() {
        if(this.countriesCount.includes(this.platform.codeCountry)){
          this.type = "countNoMesures"
          this.noMesures = true;
        }

        this.stations$ = of(this.platform.stations);
        this.countForm.controls.codePlatform.setValue(this.platform ? this.platform.code : null);
        this.countForm.controls.codeSurvey.setValue(this.survey ? this.survey.code : null);
        (this.platform !== undefined) ? this.countForm.controls.codePlatform.disable() : this.countForm.controls.codePlatform.enable();
        (this.survey !== undefined) ? this.countForm.controls.codeSurvey.disable() : this.countForm.controls.codeSurvey.enable();
        if(this.count) {
            this.countForm.controls.code.setValue(this.count.code);
            this.countForm.controls.codeStation.setValue(this.count.codeStation);
            this.countForm.controls.date.setValue(this.count.date);
            this.countForm.controls.monospecies.setValue(this.count.monospecies);
            this.countForm.controls.count.get("codeSpecies").setValue(this.count.count.codeSpecies);
            this.countForm.controls.count.get("quantity").setValue(this.count.count.quantity);
        } else {
            this.countForm.controls.code.setValue(this.survey.code + "_");
            this.countForm.controls.monospecies.setValue(false);
        }
        this.initMesures();
    }

    newMesure(code, long, larg) {
        return this._fb.group({
            codeSpecies: new FormControl(code),
            long: new FormControl(long),
            larg: new FormControl(larg),
        });
    }

    addMesure() {
        const control = <FormArray>this.countForm.controls['mesures'];
        const sp1 = <FormArray>control.controls[0];

        let sp = control && control.controls[0] && sp1.controls['codeSpecies'].value;
        const addrCtrl = this.newMesure(this.countForm.controls.monospecies?sp:'', '', '');
        control.push(addrCtrl);
    }

    removeMesure(i: number) {
        const control = <FormArray>this.countForm.controls['mesures'];
        control.removeAt(i);
    }

    submit() {
        if (this.countForm.valid) {
            this.countForm.value.codePlatform=this.countForm.controls.codePlatform.value;
            this.countForm.value.codeSurvey=this.countForm.controls.codeSurvey.value;
            this.submitted.emit(this.countForm.value);
        }
    }

    return() {
        let redirect = this.count ? 'count/'+this.platform.code+'/'+this.survey.code+'/'+this.count.code : '/survey/' + this.platform.code + "/" + this.survey.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}
