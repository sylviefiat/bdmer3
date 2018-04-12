import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { IAppState, getSelectedCountryPlatforms } from '../../modules/ngrx/index';

import { AnalyseAction } from '../../modules/analyse/actions/index';
import { CountriesAction, CountryAction } from '../../modules/countries/actions/index';
import { Country } from '../../modules/countries/models/country';
import { Platform, Zone, Survey, Transect, Species } from '../../modules/datas/models/index';

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
    @Input() platforms$: Observable<Platform[]>;
    
    /*surveys: Survey[];
    zonesList: Zone[][];
    transectsList: Transect[][];*/
    @Input() isAdmin: boolean;
    @Input() locale: string;
    @Output() countryEmitter = new EventEmitter<Country>();
    @Output() analyse = new EventEmitter<String>();

    currentPlatforms: Platform[];
    currentSurveys: Survey[];
    currentZones: Zone[][];

    countryFormGroup: FormGroup = new FormGroup({
        country: new FormControl()
    });
    platformsFormGroup: FormGroup = new FormGroup({
        platforms: this._fb.array([])
    });
    yearFormGroup: FormGroup = new FormGroup({
        years: new FormControl()
    });
    surveysFormGroup: FormGroup = new FormGroup({
        surveys: new FormControl()
    });
    zonesFormGroup: FormGroup = new FormGroup({
        zones: new FormControl()
    });
    transectsFormGroup: FormGroup = new FormGroup({
        transects: new FormControl()
    });
    speciesFormGroup: FormGroup = new FormGroup({
        species: new FormControl()
    });
    analyseFormGroup: FormGroup = new FormGroup({
        analyseType: new FormControl()
    });

    constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions, private _fb: FormBuilder) {

    }

    ngOnInit() {        
        
    }

    ngAfterContentChecked() {        
        
    }

    

    setCountry(country: Country) {
        this.countryEmitter.emit(country);  
    }

    setZones(zones: Zone[][]) {
        let zname=[];
        for(let i in zones){
            zname[i]=[];
            for(let z of zones[i])
                zname[i].push(z.properties.code);
        }
        //this.zoneEmitter.emit(zones);
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