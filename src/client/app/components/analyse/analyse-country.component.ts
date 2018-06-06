import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Country } from '../../modules/countries/models/country';

@Component({
  selector: 'bc-analyse-country',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ 'SELECT_COUNTRY' | translate }}</h2>
    <mat-form-field [formGroup]="form">    
      <mat-select placeholder="{{ 'SELECT_COUNTRY' | translate}}" [formControlName]="inputName" (selectionChange)="countryEmitter.emit($event.value)" required>
        <mat-option *ngFor="let pays of countries" [value]="pays">{{ pays.name }}</mat-option>
      </mat-select>
    </mat-form-field> 
  `,
})
export class AnalyseCountryComponent {
  @Input() countries: Country[];
  @Input() form: FormGroup;
  @Input() inputName: string;
  @Output() countryEmitter = new EventEmitter<Country>();

  constructor() {

  }

}
