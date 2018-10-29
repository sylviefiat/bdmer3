import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Year } from '../../modules/analyse/index';

@Component({
  selector: 'bc-year',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'year'" (change)="change('check',$event)">
          <span>{{ year.year }} </span>
          <span *ngIf="form.controls.year.value" class="smaller">
            <span>&nbsp;&nbsp;-&nbsp;{{ 'AFFINE_PERIOD' | translate }}&nbsp;&nbsp;</span>
            <mat-form-field>
              <input matInput [matDatepicker]="startPicker" [min]="minDate" [max]="endDate" placeholder="{{ 'START_DATE' | translate }}" [(value)]="startDate" (dateInput)="change('start',$event)">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>
            <span>&nbsp;&nbsp;</span>
            <mat-form-field> 
              <input matInput [matDatepicker]="endPicker" [min]="startDate" [max]="maxDate" placeholder="{{ 'END_DATE' | translate }}" [(value)]="endDate" (dateInput)="change('end',$event)">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>
            <mat-checkbox *ngIf="isFirst" [value]="checked" (change)="changePeriod()">{{ 'APPLY_OTHERS' | translate}}</mat-checkbox>
          </span>
        </mat-checkbox>
    </div>
  `,
  styles:[`
    .smaller {
      font-size: smaller;
    }
  `]
})
export class YearComponent implements OnInit {
  @Input() year: Year;
  @Input() isFirst: boolean;
  @Input('group') public form: FormGroup;
  @Output() yearEmitter = new EventEmitter<Year>();
  @Output() periodEmitter = new EventEmitter<any>();
  minDate:Date;
  maxDate: Date;
  startDate: Date;
  endDate: Date;
  checked: boolean = false;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit(){
    console.log(this.year);
    this.minDate=this.year.startDate;
    this.maxDate=this.year.endDate;
    this.startDate = this.minDate;
    this.endDate = this.maxDate;    
  }

  change(type:string,event: any){
    switch (type) {
      case "start":
        this.startDate = event.value;
        break;
      case "end":
        this.endDate = event.value;
        break;
      case "check":
      default:        
        break;
    }
    return this.yearEmitter.emit({year:this.year.year,startDate:this.startDate,endDate:this.endDate,checked:this.form.controls['year'].value});
  }

  changePeriod(value) {
    console.log(value);
    if(value.checked){
      return this.periodEmitter.emit({startDate:this.startDate,endDate:this.endDate});
    }
  }
}
