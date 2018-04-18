import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Zone } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-zone',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'zone'" (change)="change($event)">
          {{ zone.code }} - ({{ zone.transects.length }} {{ 'TRANSECTS' | translate }})
        </mat-checkbox>
    </div>
  `,
})
export class ZoneComponent {
  @Input() zone: Zone;
  @Input('group') public form: FormGroup;
  @Output() zoneEmitter = new EventEmitter<{zone:Zone,checked:boolean}>();

  constructor(private _fb: FormBuilder) {
    
  }

  change(value: any){
    return this.zoneEmitter.emit({zone:this.zone,checked:value.checked});
  }
}
