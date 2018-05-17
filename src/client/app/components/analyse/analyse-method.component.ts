import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Method } from '../../modules/analyse/models/index';
import { initMethods } from '../../modules/analyse/states/index';

@Component({
  selector: 'bc-analyse-method',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ 'SELECT_METHOD' | translate }}</h2>
    <mat-form-field [formGroup]="form">    
      <mat-select placeholder="{{ 'SELECT_METHOD' | translate}}" [formControlName]="inputName" (change)="methodEmitter.emit($event.value)" [value]="methods[0].method" required>
        <mat-option *ngFor="let method of methods" [value]="method">{{ method.method | translate }}</mat-option>
      </mat-select>
    </mat-form-field> 
  `,
})
export class AnalyseMethodComponent {
  @Input() form: FormGroup;
  @Input() inputName: string;
  @Output() methodEmitter = new EventEmitter<Method>();

  constructor() {

  }

  get methods(): Method[] {
    return initMethods;
  }

}
