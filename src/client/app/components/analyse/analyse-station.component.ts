import { Observable } from 'rxjs/Observable';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Station } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-analyse-station',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
      <h2>{{ 'SELECT_STATIONS' | translate }}</h2>
      <mat-checkbox (change)="checkAll($event)">
          {{ 'CHECK_ALL' | translate }}
        </mat-checkbox>
      <div  class="stations">
        <div *ngFor="let station of stations$ | async; let i=index">
          <bc-station [group]="form.controls.stations.controls[i]" [station]="station" (stationEmitter)="changeValue($event)"></bc-station>
        </div>
      </div>
    </div>
  `,

  styles: [
    `
    .stations {
      margin-top:10px;
      margin-bottom:10px;
      padding:5px;
      border: 1px solid grey;
    }
    `]
})
export class AnalyseStationComponent implements OnInit {
  @Input() stations$: Observable<Station[]>;
  defaultStations: Station[] = [];
  checkedStations: Station[] = [];
  @Output() stationEmitter = new EventEmitter<Station[]>();
  @Input('group') public form: FormGroup;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {
    this.initStations();
  }

  newStation(t: Station) {
    return this._fb.group({
      station: new FormControl(this.checkedStations.filter(station => station.properties.code === t.properties.code).length > 0)
    });
  }

  initStations() {
    this.stations$
      .filter(stations => stations !== null)
      .subscribe(stations => {
        this.defaultStations=[];
        this.form.controls['stations'] = this._fb.array([]);
        for (let station of stations) {
          this.defaultStations.push(station);
          const control = <FormArray>this.form.controls['stations'];
          control.push(this.newStation(station));
        }
      })
  }

  changeValue(transCheck: any) {
    console.log(transCheck);
    this.checkedStations=[...this.checkedStations.filter(t => t.properties.code!==transCheck.station.code)];
    if(transCheck.checked){
      this.checkedStations.push(transCheck.station);
    }
    this.checkedStations=[...this.checkedStations.filter(p => p.properties.code!==transCheck.stations.code)];
    this.stationEmitter.emit(this.checkedStations);
  }

  checkAll(ev) {
    const control = <FormArray>this.form.controls['stations'];
    control.value.forEach(x => x.station = ev.checked)
    control.setValue(control.value);
    this.checkedStations=(ev.checked)?this.defaultStations:[];
    this.stationEmitter.emit(this.checkedStations);
  }

}
