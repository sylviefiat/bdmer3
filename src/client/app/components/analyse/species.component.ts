import { Component, OnInit, OnChanges, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Species, Dimensions, LegalDimensions } from '../../modules/datas/models/index';
import { DimensionsAnalyse } from '../../modules/analyse/models/index';
import { Country } from '../../modules/countries/models/country';

@Component({
  selector: 'bc-species',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="formSp">
        <mat-checkbox [formControlName]="'species'" (change)="changeCheck($event)">
          <mat-card>
            <mat-card-title-group>
              <img mat-card-sm-image [src]="species.picture"/>
              <mat-card-title>{{ species.scientificName }}</mat-card-title>
              <mat-card-subtitle *ngFor="let name of species.names">{{ name.lang }}: {{ name.name }}</mat-card-subtitle>
            </mat-card-title-group>
            <mat-card-content *ngIf="legalDims">
              <h5 mat-subheader>{{ 'LEGAL_DIMS' | translate }}</h5>
              <p>
                min {{ legalDims.longMin}}mm<span *ngIf="legalDims.longMax">, max {{legalDims.longMax}}mm</span>
              </p>
            </mat-card-content>
            <mat-card-content [formGroup]="formDims">
              <h5 mat-subheader>{{ 'SPECIES_MIN_DIMS' | translate }}</h5>
              <mat-form-field>
                <input type="text" placeholder="{{'LONG_MIN' | translate}}" (change)="changeLMins($event)" matInput formControlName="longMin" [matAutocomplete]="auto1">
                <mat-autocomplete (optionSelected)="changeLMins($event.option.value)" #auto1="matAutocomplete">
                  <mat-option *ngFor="let option of optionsL" [value]="option">
                    {{ option }}
                  </mat-option>
                </mat-autocomplete>
              </mat-form-field>
              <mat-form-field>
                <input type="text" placeholder="{{'LONG_MAX' | translate}}" (change)="changeLMax($event)" matInput formControlName="longMax" [matAutocomplete]="auto2">
                <mat-autocomplete (optionSelected)="changeLMax($event.option.value)" #auto2="matAutocomplete">
                  <mat-option *ngFor="let option of optionsL" [value]="option">
                    {{ option }}
                  </mat-option>
                </mat-autocomplete>
              </mat-form-field>
            </mat-card-content>
          </mat-card>
        </mat-checkbox>
    </div>
  `,
  styles: [
  `
    mat-card {
      width: 400px;
      height: auto;
    }
    h5 {
      white-space:normal;
    }
  `]
})
export class SpeciesComponent implements OnInit {
  MAX_LENGTH = 1000;
  MIN = 5;
  @Input() species: Species;
  @Input() locale: string;
  @Input() currentCountry: Country;
  @Input('group') public formSp: FormGroup;
  @Input('dims') public formDims: FormGroup;
  @Output() speciesEmitter = new EventEmitter<{species:Species,dims:DimensionsAnalyse,checked:boolean}>();
  dimensions: DimensionsAnalyse = { codeSp:null,longMin:"0",longMax:"0" };
  legalDims: LegalDimensions;
  isChecked: boolean = false;
  optionsL : string[] = [];

  constructor(private _fb: FormBuilder) {

  }

  filter(option: string, options: string[]){
    return options.filter(opt => opt.startsWith(option));
  }

  ngOnInit(){
    this.legalDims = this.species.legalDimensions.filter(ld => ld.codeCountry === this.currentCountry.code) &&
      this.species.legalDimensions.filter(ld => ld.codeCountry === this.currentCountry.code).length > 0 &&
      this.species.legalDimensions.filter(ld => ld.codeCountry === this.currentCountry.code)[0];
    if (this.species.biologicDimensions.longMax) {
      this.formDims.controls['longMax'].setValue(this.species.biologicDimensions.longMax);
    }
    for (let i = this.MIN; i < this.MAX_LENGTH; i += 5) {
      if (i < this.MAX_LENGTH) this.optionsL.push(i + "");
    }

    //this.formDims.controls['longMin'].valueChanges.subscribe(option => this.changeLMins(option));
    //this.formDims.controls['longMax'].valueChanges.subscribe(option => this.changeLMax(option));
    //this.formSp.controls['species'].valueChanges.subscribe(option => this.changeCheck(option));
  }

  changeCheck(value: any){
    this.isChecked = value;
    this.dimensions={codeSp: this.species.code,longMin:this.formDims.value.longMin,longMax:this.formDims.value.longMax};
    return this.send();
  }

  changeLMins(value: any){
    this.dimensions={codeSp: this.species.code,longMin:value,longMax:this.formDims.value.longMax};
    return this.send();
  }

  changeLMax(value: any){
    this.dimensions={codeSp: this.species.code,longMin:this.formDims.value.longMin,longMax: value};
    return this.send();
  }

  send(){
    return this.speciesEmitter.emit({species:this.species,dims:this.dimensions,checked:this.isChecked});
  }

  get name(){
    let name = "";
    if(this.species.names.filter(name => name.lang === this.currentCountry.code).length > 0){
      name += ", "+this.species.names.filter(name => name.lang === this.currentCountry.code)[0].name;
    }
    if(this.species.names.filter(name => name.lang.toLowerCase() === this.locale).length > 0){
      name += ", "+this.species.names.filter(name => name.lang.toLowerCase() === this.locale)[0].name;
    }
    return name;
  }

  get picture(): string | boolean {
    return this.species.picture;
  }
}
