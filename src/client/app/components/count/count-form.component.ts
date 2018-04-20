import { of } from 'rxjs/observable/of';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Platform, Zone, Transect, Survey, Count, Species } from '../../modules/datas/models/index';

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
    @Input() zone: Zone | null;
    @Input() transect: Transect | null;
    @Input() survey: Survey | null;
    @Input() count: Count | null;
    @Input() errorMessage: string;
    @Input() species: Species[];
    @Input() zones: Zone[];
    @Input() transects$: Observable<Transect[]>;

    @Output() submitted = new EventEmitter<Survey>();

    countForm: FormGroup = new FormGroup({
        code: new FormControl("", Validators.required),
        codeSurvey: new FormControl(),
        codePlatform: new FormControl(""),
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
        } 
    }

    ngOnInit() {  
        this.zones = this.platform.zones;//.filter(zone => zone.transects !== null && zone.transects.length >0);   
        this.countForm.controls.codePlatform.setValue(this.platform ? this.platform.code : null);
        this.countForm.controls.codeSurvey.setValue(this.survey ? this.survey.code : null);
        (this.platform !== undefined) ? this.countForm.controls.codePlatform.disable() : this.countForm.controls.codePlatform.enable();
        (this.survey !== undefined) ? this.countForm.controls.codeSurvey.disable() : this.countForm.controls.codeSurvey.enable();
        if(this.count) {
            this.countForm.controls.code.setValue(this.count.code);
            this.countForm.controls.codeZone.setValue(this.count.codeZone);
            this.countForm.controls.codeTransect.setValue(this.count.codeTransect);
            this.countForm.controls.date.setValue(this.count.date);
            this.countForm.controls.monospecies.setValue(this.count.monospecies);
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

    updateTransects(codeZone: string){
        console.log(codeZone);
        console.log(this.zones.filter(zone => zone.properties.code === codeZone)[0].transects);
        this.transects$ = of(this.zones.filter(zone => zone.properties.code === codeZone)[0].transects);
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