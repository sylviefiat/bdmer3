import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Species } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

@Component({
  selector: 'bc-species',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'species'" (change)="change($event)">
        <div class="label">
          <i>{{ species.scientificName }}</i><span> {{ name }}</span>
        </div>
        </mat-checkbox>
    </div>
  `,
  styles: [
  `
    mat-checkbox .mat-checkbox-label {
      display: flex;
      flex-direction: row;
    }
  `]
})
export class SpeciesComponent {
  @Input() species: Species;
  @Input() locale: string;
  @Input() currentCountry: Country;
  @Input('group') public form: FormGroup;
  @Output() speciesEmitter = new EventEmitter<{species:Species,checked:boolean}>();

  constructor(private _fb: FormBuilder) {
    
  }

  change(value: any){
    return this.speciesEmitter.emit({species:this.species,checked:value.checked});
  }

  get haveVernacular(){
    console.log(this.species);
    return this.currentCountry && this.species.names.filter(name => name.lang === this.currentCountry.code).length > 0;
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
