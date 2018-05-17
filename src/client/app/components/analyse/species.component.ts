import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
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
                {{ legalDims.longMin}}mm / {{legalDims.longMax}}mm 
              </p>
            </mat-card-content>
            <mat-card-content [formGroup]="formDims">
              <h5 mat-subheader>{{ 'SPECIES_MIN_DIMS' | translate }}</h5>
              <mat-form-field>
                <input (change)="changeMins($event)" type="text" placeholder="{{'LONG_MIN' | translate}}" aria-label="Number" matInput [formControlName]="'longMin'" [matAutocomplete]="auto1">
                <mat-autocomplete #auto1="matAutocomplete">
                  <mat-option *ngFor="let option of lenghtOptions" [value]="option">
                    {{ option }}
                  </mat-option>
                </mat-autocomplete>
              </mat-form-field> 
              <mat-form-field>
                <input (change)="changeMins($event)" type="text" placeholder="{{'LARG_MIN' | translate}}" aria-label="Number" matInput [formControlName]="'largMin'" [matAutocomplete]="auto2">
                <mat-autocomplete #auto2="matAutocomplete">
                  <mat-option *ngFor="let option of widthOptions" [value]="option">
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
  `]
})
export class SpeciesComponent implements OnInit {
  MAX_LENGTH = 1000;
  MAX_WIDTH = 500;
  @Input() species: Species;
  @Input() locale: string;
  @Input() currentCountry: Country;
  @Input('group') public formSp: FormGroup;
  @Input('dims') public formDims: FormGroup;
  @Output() speciesEmitter = new EventEmitter<{species:Species,dims:DimensionsAnalyse,checked:boolean}>();
  dimensions: DimensionsAnalyse = { longMin:0,largMin:0 };
  legalDims: LegalDimensions;
  isChecked: boolean;


  constructor(private _fb: FormBuilder) {
    
  }

  ngOnInit(){
    this.legalDims = this.species.legalDimensions.filter(ld => ld.codeCountry === this.currentCountry.code) && 
      this.species.legalDimensions.filter(ld => ld.codeCountry === this.currentCountry.code).length>0 && 
      this.species.legalDimensions.filter(ld => ld.codeCountry === this.currentCountry.code)[0];
  }

  changeCheck(value: any){
    this.isChecked = value.checked;
    return this.send();
  }

  changeMins(value: any){
    console.log(this.formDims.value);
    this.dimensions=this.formDims.value;
    if(this.isChecked)
      return this.send();
  }

  send(){
    return this.speciesEmitter.emit({species:this.species,dims:this.dimensions,checked:this.isChecked});
  }

  get haveVernacular(){
    return this.currentCountry && this.species.names.filter(name => name.lang === this.currentCountry.code).length > 0;
  }

  get name(){
    console.log(this.currentCountry);
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

  get lenghtOptions(){
    let options : number[] = [];
    for(let i=5; i<this.MAX_LENGTH; i+=5){
      options.push(i);
    }
    return options;
  }

  get widthOptions(){
    let options : number[] = [];
    for(let i=5; i<this.MAX_WIDTH; i+=5){
      options.push(i);
    }
    return options;
  }
}
