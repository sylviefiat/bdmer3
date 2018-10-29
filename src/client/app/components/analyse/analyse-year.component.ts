import { Observable, Subscription } from 'rxjs';
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
        <div *ngFor="let year of (years$ | async); let i=index">
          <bc-year [group]="form.controls.years.controls[i]" [isFirst]="i===0" [year]="defaultYears[i]" (yearEmitter)="changeValue($event)" (periodEmitter)="setDefaultPeriod($event)"></bc-year>
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
export class AnalyseYearComponent implements OnInit, OnDestroy {
    @Input() years$: Observable<number[]>;
    defaultYears : Year[] = [];
    checkedYears : Year[] = [];
    @Output() yearEmitter = new EventEmitter<any[]>();
    @Input('group') public form: FormGroup;
    actionsSubscription: Subscription;

    constructor(private _fb: FormBuilder) {
        
    }

    ngOnInit() {
        this.actionsSubscription = this.years$.subscribe(years => {
            this.defaultYears = years.map(year=>{return {year:year,startDate:new Date(year+"-01-01"),endDate:new Date(year+"-12-31")};});
            this.initYears();
        });        
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    newYear(y: Year) {
        return this._fb.group({
            year: new FormControl(this.checkedYears.filter((year:Year) => year.year === y.year).length > 0)
        });
    }

    initYears() {
        if(this.defaultYears !== undefined){
            this.form.controls['years'] = this._fb.array([]);
            for (let year of this.defaultYears) {
                const control = <FormArray>this.form.controls['years'];
                control.push(this.newYear(year));
            }
        }
    }

    changeValue(yearCheck: any) {
        this.checkedYears = [...this.checkedYears.filter(y => y.year !== yearCheck.year)];
        if (yearCheck.checked) {
            this.checkedYears.push(yearCheck);
        }
        this.yearEmitter.emit(this.checkedYears);
    }

    setDefaultPeriod(period: any){
        console.log(period);

    }

    checkAll(ev) {
        const control = <FormArray>this.form.controls['years'];
        control.value.forEach(x => x.year = ev.checked)
        control.setValue(control.value);
        this.checkedYears = (ev.checked) ? this.defaultYears : [];
        this.yearEmitter.emit(this.checkedYears);
    }

}
