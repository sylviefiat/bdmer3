import { Observable } from 'rxjs/Observable';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Transect } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-analyse-transect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
      <h2>{{ 'SELECT_TRANSECTS' | translate }}</h2>
      <mat-checkbox (change)="checkAll($event)">
          {{ 'CHECK_ALL' | translate }}
        </mat-checkbox>
      <div  class="transects">
        <div *ngFor="let transect of transects$ | async; let i=index">
          <bc-transect [group]="form.controls.transects.controls[i]" [transect]="transect" (transectEmitter)="changeValue($event)"></bc-transect>
        </div>
      </div>
    </div>
  `,

  styles: [
    `
    .transects {
      margin-top:10px;
      margin-bottom:10px;
      padding:5px;
      border: 1px solid grey;
    }
    `]
})
export class AnalyseTransectComponent implements OnInit {
  @Input() transects$: Observable<Transect[]>;
  defaultTransects: Transect[] = [];
  checkedTransects: Transect[] = [];
  @Output() transectEmitter = new EventEmitter<Transect[]>();
  @Input('group') public form: FormGroup;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {
    this.initTransects();
  }

  newTransect(t: Transect) {
    return this._fb.group({
      transect: new FormControl(this.checkedTransects.filter(transect => transect.code === t.code).length > 0)
    });
  }

  initTransects() {
    this.transects$
      .filter(transects => transects !== null)
      .subscribe(transects => {
        this.defaultTransects=[];
        this.form.controls['transects'] = this._fb.array([]);
        for (let transect of transects) {
          this.defaultTransects.push(transect);
          const control = <FormArray>this.form.controls['transects'];
          control.push(this.newTransect(transect));
        }
      })
  }

  changeValue(transCheck: any) {
    console.log(transCheck);
    this.checkedTransects=[...this.checkedTransects.filter(t => t.code!==transCheck.transect.code)];
    if(transCheck.checked){
      this.checkedTransects.push(transCheck.transect);
    }
    this.checkedTransects=[...this.checkedTransects.filter(p => p.code!==transCheck.transects.code)];
    this.transectEmitter.emit(this.checkedTransects);
  }

  checkAll(ev) {
    const control = <FormArray>this.form.controls['transects'];
    control.value.forEach(x => x.transect = ev.checked)
    control.setValue(control.value);
    this.checkedTransects=(ev.checked)?this.defaultTransects:[];
    this.transectEmitter.emit(this.checkedTransects);
  }

}
