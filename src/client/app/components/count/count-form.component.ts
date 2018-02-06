import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Site, Zone, Transect, Campaign, Count, Species } from '../../modules/datas/models/index';

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
    @Input() campaign: Campaign | null;
    @Input() count: Count | null;
    @Input() errorMessage: string;
    @Input() species: Species[];
    @Input() zones: Zone[];
    @Input() transects: Transect[];

    @Output() submitted = new EventEmitter<Campaign>();

    countForm: FormGroup = new FormGroup({
        code: new FormControl("", Validators.required),
        codeCampaign: new FormControl(),
        codeSite: new FormControl(""),
        codeZone: new FormControl(""),
        codeTransect: new FormControl(),
        date: new FormControl(""),
        monospecies: new FormControl(),
        mesures: this._fb.array([])
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
        } else {
            //return this.addMesure();
        }
    }

    ngOnInit() {  
        this.zones = this.site.zones;   
        this.countForm.controls.codeSite.setValue(this.site ? this.site.code : null);
        this.countForm.controls.codeCampaign.setValue(this.campaign ? this.campaign.code : null);
        (this.site !== undefined) ? this.countForm.controls.codeSite.disable() : this.countForm.controls.codeSite.enable();
        (this.campaign !== undefined) ? this.countForm.controls.codeCampaign.disable() : this.countForm.controls.codeCampaign.enable();
        if(this.count) {
            this.countForm.controls.code.setValue(this.count.code);
            this.countForm.controls.codeZone.setValue(this.count.codeZone);
            this.countForm.controls.codeTransect.setValue(this.count.codeTransect);
            this.countForm.controls.date.setValue(this.count.date);
            this.countForm.controls.monospecies.setValue(this.count.monospecies);
        } else {
            this.countForm.controls.code.setValue(this.campaign.code + "_");
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
            this.countForm.value.codeSite=this.countForm.controls.codeSite.value;
            this.countForm.value.codeCampaign=this.countForm.controls.codeCampaign.value;
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