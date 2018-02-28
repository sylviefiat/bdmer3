import { Component, OnInit,AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
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

    optionalFormGroup: FormGroup = new FormGroup({
        country: new FormControl()
    });
    firstFormGroup: FormGroup = new FormGroup({
        campaigns: new FormControl([])
    });
    secondFormGroup: FormGroup = new FormGroup({
        zones: new FormControl()
    });
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup = new FormGroup({
        species: new FormControl()
    });
    fifthFormGroup: FormGroup = new FormGroup({
        analyseType: new FormControl()
    });



    constructor(private store: Store<IAppState>, route: ActivatedRoute,public routerext: RouterExtensions, fb: FormBuilder) { 
        this.thirdFormGroup = fb.group({
          transects: [[''], Validators.required]
        });
    }

    ngOnInit() {
    }

    ngAfterContentChecked() {
        console.log(this.thirdFormGroup.controls.transects);
        this.thirdFormGroup.controls.transects.value.foreach(x => x.select());
    }

    setCountry(country: Country) {
        this.countryEmitter.emit(country);
        this.firstFormGroup.controls['campaigns']=new FormControl();
    }

    setCampaigns(campaigns: Campaign[]) {
        this.campaignEmitter.emit(campaigns);
        this.secondFormGroup.controls.zones=new FormControl();
        this.thirdFormGroup.controls.transects=new FormControl();
        this.currentCampaigns = campaigns;
    }

    setZones(zones: Zone[][]) {
        this.zoneEmitter.emit(zones);        
        this.currentZones = zones;
    }

    get localDate(){
    switch (this.locale) {
      case "fr":
        return 'dd-MM-yyyy';
      case "en":
      default:
        return 'MM-dd-yyyy';
    }
  }

}