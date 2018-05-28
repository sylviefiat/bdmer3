import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'bc-year',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'year'" (change)="change($event)">
          {{ year }}
        </mat-checkbox>
    </div>
  `,
})
export class YearComponent {
  @Input() year: string;
  @Input('group') public form: FormGroup;
  @Output() yearEmitter = new EventEmitter<{year:string,checked:boolean}>();

  constructor(private _fb: FormBuilder) {
    
  }

  change(value: any){
    return this.yearEmitter.emit({year:this.year,checked:value.checked});
  }
}
