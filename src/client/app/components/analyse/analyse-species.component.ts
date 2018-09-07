import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, AfterContentChecked, OnDestroy, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Species } from '../../modules/datas/models/index';
import { DimensionsAnalyse } from '../../modules/analyse/models/index';
import { Country } from '../../modules/countries/models/country';

@Component({
    selector: 'bc-analyse-species',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div [formGroup]="form">
      <h2>{{ 'SELECT_MANY_SPECIES' | translate }}</h2>
      <mat-checkbox (change)="checkAll($event)">
          {{ 'CHECK_ALL' | translate }}
        </mat-checkbox>
      <div  class="species">
        <div class="speciesCards" *ngFor="let species of species$ | async; let i=index">
          <bc-species [group]="form.controls.species.controls[i]" [dims]="form.controls.dimensions.controls[i]" [species]="species" [currentCountry]="currentCountry$ | async"
            [locale]="locale" (speciesEmitter)="changeValue($event)"></bc-species>
        </div>
      </div>
    </div>
  `,

    styles: [
        `
    .species {
      margin-top:10px;
      margin-bottom:10px;
      padding:5px;
      border: 1px solid grey;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .speciesCard {
      padding-left: 10px;
    }
    `]
})
export class AnalyseSpeciesComponent implements OnInit, OnDestroy {
    @Input() species$: Observable<Species[]>;
    @Input() currentCountry$: Observable<Country>;
    @Input() locale: string;
    defaultSpecies: Species[] = [];
    checkedSpecies: Species[] = [];
    allSpeciesDims: DimensionsAnalyse[] = [];
    defaultDimension: DimensionsAnalyse = { codeSp:null,longMin:0,longMax:0 };
    @Output() speciesEmitter = new EventEmitter<Species[]>();
    @Output() dimensionsEmitter = new EventEmitter<DimensionsAnalyse[]>();
    @Input('group') public form: FormGroup;
    actionsSubscription: Subscription;

    constructor(private _fb: FormBuilder) {

    }

    ngOnInit() {
        this.actionsSubscription = this.species$.subscribe(species => {
            this.defaultSpecies = species;
            for(let s of species){
                this.allSpeciesDims.push( { codeSp:s.code,longMin:0,longMax:0 });
            }
            this.initSpecies();
        });

    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    newSpecies(s: Species) {
        return this._fb.group({
            species: new FormControl(this.checkedSpecies.filter(species => species.code === s.code).length > 0)
        });
    }

    newDimensions(s: Species) {
        let dims = this.allSpeciesDims.filter(dims => dims.codeSp === s.code).length > 0 && this.allSpeciesDims.filter(dims => dims.codeSp === s.code)[0];
        return this._fb.group({
            longMin: new FormControl(dims ? dims.longMin : "0"),
            longMax: new FormControl(dims ? dims.longMax : "0")
        });
    }

    initSpecies() {
        if(this.defaultSpecies !== null){
            this.form.controls['species'] = this._fb.array([]);
            this.form.controls['dimensions'] = this._fb.array([]);
            for (let sp of this.defaultSpecies) {
                const controlSP = <FormArray>this.form.controls['species'];
                controlSP.push(this.newSpecies(sp));
                const controlDM = <FormArray>this.form.controls['dimensions'];
                controlDM.push(this.newDimensions(sp));
            }
        }
    }

    changeValue(spCheck: any) {
        this.checkedSpecies = [...this.checkedSpecies.filter(s => s.code !== spCheck.species.code)];
        this.allSpeciesDims = [...this.allSpeciesDims.filter(s => s.codeSp !== spCheck.species.code)];

        if (spCheck.checked) {
            this.checkedSpecies.push(spCheck.species);
            this.allSpeciesDims.push(spCheck.dims);
        }
        this.speciesEmitter.emit(this.checkedSpecies);
        this.dimensionsEmitter.emit(this.allSpeciesDims.filter(dims => this.checkedSpecies.map(sp=>sp.code).indexOf(dims.codeSp)>-1));

    }

    checkAll(ev) {
        const control = <FormArray>this.form.controls['species'];
        control.value.forEach(x => x.species = ev.checked)
        control.setValue(control.value);
        this.checkedSpecies = (ev.checked) ? this.defaultSpecies : [];
        this.speciesEmitter.emit(this.checkedSpecies);
        this.dimensionsEmitter.emit(this.allSpeciesDims.filter(dims => this.checkedSpecies.map(sp=>sp.code).indexOf(dims.codeSp)>-1));
    }

}
