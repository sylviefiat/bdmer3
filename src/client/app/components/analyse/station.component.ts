import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Station } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-station',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'station'" (change)="change($event)">
          {{ station.properties.code }}
        </mat-checkbox>
    </div>
  `,
})
export class StationComponent {
  @Input() station: Station;
  @Input('group') public form: FormGroup;
  @Output() stationEmitter = new EventEmitter<{station:Station,checked:boolean}>();

  constructor(private _fb: FormBuilder) {
    
  }

  change(value: any){
    return this.stationEmitter.emit({station:this.station,checked:value.checked});
  }
}
