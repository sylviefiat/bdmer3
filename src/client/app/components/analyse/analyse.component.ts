import { Component, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';

import { IAppState } from '../../modules/ngrx/index';

import { Country } from '../../modules/countries/models/country';
import { Platform, Zone, Survey, Station, Species } from '../../modules/datas/models/index';
import { Method, DimensionsAnalyse } from '../../modules/analyse/models/index';

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
    @Input() years$: Observable<[]>;
    @Input() surveys$: Observable<Survey[]>;
    @Input() zones$: Observable<Zone[]>;
    @Input() usedZones$: Observable<Zone[]>;
    @Input() stations$: Observable<Station[]>;
    @Input() species$: Observable<Species[]>;
    @Input() dimensions$: Observable<DimensionsAnalyse[]>;
    @Input() methodsAvailables$: Observable<Method[]>;
    @Input() isAdmin$: Observable<boolean>;
    @Input() locale: string;
    @Output() countryEmitter = new EventEmitter<Country>();
    @Output() platformEmitter = new EventEmitter<Platform[]>();
    @Output() yearEmitter = new EventEmitter<number[]>();
    @Output() surveyEmitter = new EventEmitter<Survey[]>();
    @Output() zoneEmitter = new EventEmitter<Zone[]>();
    @Output() stationEmitter = new EventEmitter<Station[]>();
    @Output() speciesEmitter = new EventEmitter<Species[]>();
    @Output() dimensionsEmitter = new EventEmitter<DimensionsAnalyse[]>();
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
    stationsFormGroup: FormGroup = new FormGroup({
        stations: new FormControl()
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

    setYears(years: []) {
        this.yearEmitter.emit(years); 
    }

    setSurveys(surveys: Survey[]) {
        this.surveyEmitter.emit(surveys);
    }

    setZones(zones: Zone[]) {
        this.zoneEmitter.emit(zones); 
    }

    setStations(stations: Station[]) {
        this.stationEmitter.emit(stations); 
    }

    setSpecies(species: Species[]) {
        this.nspecies = species.length;
        this.speciesEmitter.emit(species); 
    }

    setDimensions(dimensions: DimensionsAnalyse[]) {
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
        //console.log("start");
        this.analyse.emit("ok");
    }

}