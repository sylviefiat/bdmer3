import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Method } from '../../modules/analyse/models/index';

@Component({
  selector: 'bc-analyse-method',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ 'SELECT_METHOD' | translate }}</h2>
    <mat-form-field [formGroup]="form">    
      <mat-select placeholder="{{ 'SELECT_METHOD' | translate}}" [formControlName]="inputName" (selectionChange)="methodEmitter.emit($event.value)" required>
        <mat-option *ngFor="let method of methods" [value]="method">{{ method.method | translate }}</mat-option>
      </mat-select>
    </mat-form-field> 
  `,
})
export class AnalyseMethodComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() inputName: string;
  @Input() methods:  Method[];
  @Output() methodEmitter = new EventEmitter<Method>();
  

  constructor() {
    
  }

  ngOnInit(){
    console.log(this.methods);
  }

}
