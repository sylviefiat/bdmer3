import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Platform } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-platform',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'platform'" (change)="change($event)">
          {{ platform.code }}
        </mat-checkbox>
    </div>
  `,
})
export class PlatformComponent {
  @Input() platform: Platform;
  @Input('group') public form: FormGroup;
  @Output() platformEmitter = new EventEmitter<any>();

  constructor(private _fb: FormBuilder) {
    
  }

  change(value: any){
    return this.platformEmitter.emit(value);
  }

  /*checkAll(ev) {
    this.platforms.forEach(x => x.state = ev.target.checked)
  }

  isAllChecked() {
    console.log('fired');
    return this.platforms.every(_ => _.state);
  }*/
}
