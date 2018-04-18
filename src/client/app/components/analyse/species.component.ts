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
          {{ name }}
        </mat-checkbox>
    </div>
  `,
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
    let name = this.species.scientificName;
    if(this.species.names.filter(name => name.lang === this.currentCountry.code).length > 0){
      name += ", "+this.species.names.filter(name => name.lang === this.currentCountry.code)[0].name+"</i>";
    }
    if(this.species.names.filter(name => name.lang === this.locale).length > 0){
      name += ", <i>"+this.species.names.filter(name => name.lang === this.currentCountry.code)[0].name+"</i>";
    }
    return name;
  }
}
