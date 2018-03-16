import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { IAppState } from '../../modules/ngrx/index';

import { AnalyseAction } from '../../modules/analyse/actions/index';
import { Country } from '../../modules/countries/models/country';
import { Site, Zone, Campaign, Transect, Species } from '../../modules/datas/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-analyse',
    templateUrl: 'analyse.component.html',
    styleUrls: [
        'analyse.component.css',
    ],
})
export class AnalyseComponent implements OnInit, AfterContentChecked {
    @Input() msg: string | null;
    @Input() countries: Country[];
    @Input() campaigns: Campaign[];
    @Input() zonesList: Zone[][];
    @Input() transectsList: Transect[][];
    @Input() isAdmin: boolean;
    @Input() locale: string;
    @Output() countryEmitter = new EventEmitter<Country>();
    @Output() campaignEmitter = new EventEmitter<Campaign[]>();
    @Output() zoneEmitter = new EventEmitter<Zone[][]>();
    @Output() analyse = new EventEmitter<String>();

    currentCampaigns: Campaign[];
    currentZones: Zone[][];

    countryFormGroup: FormGroup = new FormGroup({
        country: new FormControl()
    });
    campaignsFormGroup: FormGroup = new FormGroup({
        campaigns: new FormControl()
    });
    zonesFormGroup: FormGroup = new FormGroup({
        //zones: new FormControl([])
        campaigns: this._fb.array([])
    });
    transectsFormGroup: FormGroup = new FormGroup({
        //campaigns: new FormControl([])
        campaigns: this._fb.array([])
    });
    speciesFormGroup: FormGroup = new FormGroup({
        //campaigns: new FormControl([])
        campaigns: this._fb.array([])
    });
    analyseFormGroup: FormGroup = new FormGroup({
        analyseType: new FormControl()
    });

    constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions, private _fb: FormBuilder) {

    }

    ngOnInit() {
        //TODO
    }

    ngAfterContentChecked() {
        //TODO
    }

    initZones() {
        this.zonesFormGroup.controls['campaigns']=this._fb.array([]);
        const controlZ = <FormArray>this.zonesFormGroup.controls['campaigns'];
        let addrCtrl;
        for (let i in this.currentCampaigns) {
            addrCtrl =  this.newZones();
            controlZ.push(addrCtrl);
        }
    }

    newZones() {
        return this._fb.group({
            zones: new FormControl([])
        });
    }

    initTransects() {
        this.transectsFormGroup.controls['campaigns']=this._fb.array([]);
        const controlT = <FormArray>this.transectsFormGroup.controls['campaigns'];
        let addrCtrl;
        for (let i in this.currentCampaigns) {
            addrCtrl=this.newTransects();
            controlT.push(addrCtrl);
        }
    }

    newTransects() {
        return this._fb.group({
            transects: new FormControl([])
        });
    }

    initSpecies() {
        this.speciesFormGroup.controls['campaigns']=this._fb.array([]);
        const controlS = <FormArray>this.speciesFormGroup.controls['campaigns'];
        for (let i in this.currentCampaigns) {
            controlS.push(this.newSpecies());
        }
    }

    newSpecies() {
        return this._fb.group({
            species: new FormControl([])
        });
    }

    setCountry(country: Country) {
        this.countryEmitter.emit(country);
        this.campaignsFormGroup.controls['campaigns'] = new FormControl();
    }

    setCampaigns(campaigns: Campaign[]) {
        let cname=[];
        for(let c of campaigns){
            cname.push(c.code);
        }
        this.campaignEmitter.emit(campaigns);
        this.campaignsFormGroup.controls['campaigns'].setValue(cname);
        this.currentCampaigns = campaigns;
        this.initZones();
        this.initTransects();
        this.initSpecies();
    }

    setZones(zones: Zone[][]) {
        let zname=[];
        for(let i in zones){
            zname[i]=[];
            for(let z of zones[i])
                zname[i].push(z.code);
        }
        

        this.zoneEmitter.emit(zones);
        this.currentZones = zones;
    }

    get localDate() {
        switch (this.locale) {
            case "fr":
                return 'dd-MM-yyyy';
            case "en":
            default:
                return 'MM-dd-yyyy';
        }
    }

}