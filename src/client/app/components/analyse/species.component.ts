import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Species } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-species',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'species'" (change)="change($event)">
          {{ species.code }}
        </mat-checkbox>
    </div>
  `,
})
export class SpeciesComponent {
  @Input() species: Species;
  @Input('group') public form: FormGroup;
  @Output() speciesEmitter = new EventEmitter<{species:Species,checked:boolean}>();

  constructor(private _fb: FormBuilder) {
    
  }

  change(value: any){
    return this.speciesEmitter.emit({species:this.species,checked:value.checked});
  }
}
