import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Platform } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-platform',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'platform'"  (change)="change($event)">
          {{ platform.code }} - {{ platform.description }} ({{ platform.zones.length }} {{'ZONES' | translate}}, {{ platform.surveys.length}} {{'SURVEYS' | translate}})
        </mat-checkbox>
    </div>
  `,
})
export class PlatformComponent {
  @Input() platform: Platform;
  @Input('group') public form: FormGroup;
  @Output() platformEmitter = new EventEmitter<{platform:Platform,checked:boolean}>();

  constructor(private _fb: FormBuilder) {
    
  }

  change(value: any){
    return this.platformEmitter.emit({platform:this.platform,checked:value.checked});
  }

  isDisabled(){
    let counts = (<any>this.platform.surveys).flatMap(s => s.counts);
    console.log(counts);
    return this.platform.zones.length > 0 && this.platform.surveys.length > 0 && this.platform.stations.length > 0 && counts.length >0;
  }
}
