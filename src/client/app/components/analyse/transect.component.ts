import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Transect } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-transect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'transect'" (change)="change($event)">
          {{ transect.properties.code }}
        </mat-checkbox>
    </div>
  `,
})
export class TransectComponent {
  @Input() transect: Transect;
  @Input('group') public form: FormGroup;
  @Output() transectEmitter = new EventEmitter<{transect:Transect,checked:boolean}>();

  constructor(private _fb: FormBuilder) {
    
  }

  change(value: any){
    return this.transectEmitter.emit({transect:this.transect,checked:value.checked});
  }
}
