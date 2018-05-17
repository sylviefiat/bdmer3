import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';

import { IAppState, getSelectedCountryPlatforms } from '../../modules/ngrx/index';

import { AnalyseAction } from '../../modules/analyse/actions/index';
import { CountriesAction, CountryAction } from '../../modules/countries/actions/index';
import { Country } from '../../modules/countries/models/country';
import { Platform, Zone, Survey, Transect, Species, Dimensions } from '../../modules/datas/models/index';
import { Method } from '../../modules/analyse/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-analyse',
    templateUrl: 'analyse.component.html',
    styleUrls: [
        'analyse.component.css',
    ],
})
export class AnalyseComponent {
    @Input() msg: string | null;
    @Input() countries: Country[];
    @Input() currentCountry$: Observable<Country>;
    @Input() platforms$: Observable<Platform[]>;
    @Input() years$: Observable<string[]>;
    @Input() surveys$: Observable<Survey[]>;
    @Input() zones$: Observable<Zone[]>;
    @Input() transects$: Observable<Transect[]>;
    @Input() species$: Observable<Species[]>;
    @Input() dimensions$: Observable<Dimensions[]>;
    @Input() isAdmin: boolean;
    @Input() locale: string;
    @Output() countryEmitter = new EventEmitter<Country>();
    @Output() platformEmitter = new EventEmitter<Platform[]>();
    @Output() yearEmitter = new EventEmitter<string[]>();
    @Output() surveyEmitter = new EventEmitter<Survey[]>();
    @Output() zoneEmitter = new EventEmitter<Zone[]>();
    @Output() transectEmitter = new EventEmitter<Transect[]>();
    @Output() speciesEmitter = new EventEmitter<Species[]>();
    @Output() dimensionsEmitter = new EventEmitter<Dimensions[]>();
    @Output() methodEmitter = new EventEmitter<Method>();
    @Output() analyse = new EventEmitter<string>();
    nspecies : number = 0;

    countryFormGroup: FormGroup = new FormGroup({
        country: new FormControl()
    });
    platformsFormGroup: FormGroup = new FormGroup({
        platforms: this._fb.array([])
    });
    yearsFormGroup: FormGroup = new FormGroup({
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
        species: new FormControl(),
        dimensions: new FormControl()
    });
    analyseFormGroup: FormGroup = new FormGroup({
        analyseType: new FormControl()
    });

    constructor(private _fb: FormBuilder) {

    }    

    setCountry(country: Country) {
        this.countryEmitter.emit(country);  
    }

    setPlatforms(platforms: Platform[]) {
        this.platformEmitter.emit(platforms); 
    }

    setYears(years: string[]) {
        this.yearEmitter.emit(years); 
    }

    setSurveys(surveys: Survey[]) {
        this.surveyEmitter.emit(surveys);
    }

    setZones(zones: Zone[]) {
        this.zoneEmitter.emit(zones); 
    }

    setTransects(transects: Transect[]) {
        this.transectEmitter.emit(transects); 
    }

    setSpecies(species: Species[]) {
        this.nspecies = species.length;
        this.speciesEmitter.emit(species); 
    }

    setDimensions(dimensions: Dimensions[]) {
        this.dimensionsEmitter.emit(dimensions); 
    }

    setMethod(method: Method) {
        this.methodEmitter.emit(method); 
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

    startAnalyse(){
        console.log("go");
        this.analyse.emit("ok");
    }

}