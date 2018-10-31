import { Observable, Subscription, of } from 'rxjs';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Platform } from '../../modules/datas/index';
import { Year } from '../../modules/analyse/index';

@Component({
    selector: 'bc-analyse-year',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div [formGroup]="form"> 
      <h2>{{ 'SELECT_YEARS' | translate }}</h2>
      <mat-checkbox (change)="checkAll($event)">
          {{ 'CHECK_ALL' | translate }}
      </mat-checkbox>
      <div  class="years">
        <div *ngFor="let year of (defaultYears$ | async); let i=index">
          <bc-year [group]="form.controls.years.controls[i]" [isFirst]="i===0" [samePeriod]="samePeriod$ | async" [year]="year" (yearEmitter)="changeValue($event)" (periodEmitter)="setDefaultPeriod($event)"></bc-year>
        </div>
      </div>
    </div>
  `,

    styles: [
        `
    .years {
      margin-top:10px;
      margin-bottom:10px;
      padding:5px;
      border: 1px solid grey;
    }
    `]
})
export class AnalyseYearComponent implements OnInit {
    @Input() years$: Observable<number[]>;
    defaultYears$ : Observable<Year[]>;
    checkedYears : Year[] = [];
    @Output() yearEmitter = new EventEmitter<any[]>();
    @Input('group') public form: FormGroup;
    defaultStartMonth=0;
    defaultStartDay=1;
    defaultEndMonth=11;
    defaultEndDay=31;
    samePeriod$: Observable<boolean>;

    constructor(private _fb: FormBuilder) {        
    }

    ngOnInit() { 
        this.defaultYears$ = this.years$.map(years => {
            let defaultYears: Year[] = [];
            this.form.controls['years'] = this._fb.array([]);
            years.forEach(year => {
                let dy = {year:year,startDate:new Date(year, this.defaultStartMonth, this.defaultStartDay),endDate:new Date(year, this.defaultEndMonth, this.defaultEndDay),checked:false};
                defaultYears=[...defaultYears,dy];
                const control = <FormArray>this.form.controls['years'];
                control.push(this.newYear(dy));
            });
            return defaultYears;
        });
        this.samePeriod$ = of(false);
    }

    newYear(y: Year) {
        return this._fb.group({
            year: new FormControl(this.checkedYears.filter((year:Year) => year.year === y.year).length > 0)
        });
    }

    changeValue(yearCheck: any) {
        this.samePeriod$.subscribe(sp => {
            this.checkedYears = [...this.checkedYears.filter(y => y.year !== yearCheck.year)];   
            if(yearCheck.checked){
                this.checkedYears.push(yearCheck);
            }
            this.yearEmitter.emit(this.checkedYears);                     
            if(sp){
                this.setDefaultPeriod({startDate:yearCheck.startDate,endDate:yearCheck.endDate,checked:true});
            }
        });        
    }

    setDefaultPeriod(period: any){   
        this.defaultYears$=this.defaultYears$.map(defaultYears => {
            defaultYears.forEach((year,index) => {
                year.startDate = period.checked || !index ? new Date(year.year, period.startDate.getMonth(),period.startDate.getDate()):new Date(year.year, this.defaultStartMonth, this.defaultStartDay);
                year.endDate = period.checked || !index ? new Date(year.year, period.endDate.getMonth(),period.endDate.getDate()):new Date(year.year, this.defaultEndMonth, this.defaultEndDay);
            });
            this.checkedYears = defaultYears.filter(year => this.checkedYears.filter(y => y.year===year.year).length>0);
            console.log(this.checkedYears);
            this.yearEmitter.emit(this.checkedYears);
            this.samePeriod$ = of(period.checked);
            return defaultYears;
        });
    }

    checkAll(ev) {
        this.defaultYears$.subscribe(defaultYears => {
            this.checkedYears= ev.checked ? defaultYears : [];
            this.yearEmitter.emit(this.checkedYears);
        });
        const control = <FormArray>this.form.controls['years'];
        control.value.forEach(x => x.year = ev.checked)
        control.setValue(control.value);        
    }

}
