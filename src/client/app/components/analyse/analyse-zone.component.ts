import { Observable } from 'rxjs/Observable';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Zone } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-analyse-zone',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
      <h2>{{ 'SELECT_ZONES' | translate }}</h2>
      <mat-checkbox (change)="checkAll($event)">
          {{ 'CHECK_ALL' | translate }}
        </mat-checkbox>
      <div  class="zones">
        <div *ngFor="let zone of zones$ | async; let i=index">
          <bc-zone [group]="form.controls.zones.controls[i]" [zone]="zone" (zoneEmitter)="changeValue($event)"></bc-zone>
        </div>
      </div>
    </div>
  `,

  styles: [
    `
    .zones {
      margin-top:10px;
      margin-bottom:10px;
      padding:5px;
      border: 1px solid grey;
    }
    `]
})
export class AnalyseZoneComponent implements OnInit {
  @Input() zones$: Observable<Zone[]>;
  defaultZones: Zone[] = [];
  checkedZones: Zone[] = [];
  @Output() zoneEmitter = new EventEmitter<Zone[]>();
  @Input('group') public form: FormGroup;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {
    this.initZones();
  }

  newZone(s: Zone) {
    return this._fb.group({
      zone: new FormControl(this.checkedZones.filter(survey => survey.code === s.code).length > 0)
    });
  }

  initZones() {
    this.zones$
      .filter(zones => zones !== null)
      .subscribe(zones => {
        this.defaultZones=[];
        this.form.controls['zones'] = this._fb.array([]);
        for (let zone of zones) {
          this.defaultZones.push(zone);
          const control = <FormArray>this.form.controls['zones'];
          control.push(this.newZone(zone));
        }
      })
  }

  changeValue(zoneCheck: any) {
    console.log(zoneCheck);
    this.checkedZones=[...this.checkedZones.filter(z => z.code!==zoneCheck.zone.code)];
    if(zoneCheck.checked){
      this.checkedZones.push(zoneCheck.zone);
    }
    this.zoneEmitter.emit(this.checkedZones);
  }

  checkAll(ev) {
    const control = <FormArray>this.form.controls['zones'];
    control.value.forEach(x => x.zone = ev.checked)
    control.setValue(control.value);
    this.checkedZones=(ev.checked)?this.defaultZones:[];
    this.zoneEmitter.emit(this.checkedZones);
  }

}
