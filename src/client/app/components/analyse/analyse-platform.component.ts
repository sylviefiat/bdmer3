import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Platform } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-analyse-platform',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
      <div *ngFor="let platform of platforms; let i=index">
        <mat-checkbox 
          [formControl]="form.controls.platforms.controls[i]" [formControlName]="'platforms'" required>
          {{ platform.code }}
        </mat-checkbox>
      </div>
    </div>
  `,
})
export class AnalysePlatformComponent implements OnInit {
  @Input() platforms: Platform[];
  @Input() inputName: string;
  @Output() platformEmitter = new EventEmitter<Platform>();
  @Input('group')
    public form: FormGroup;

  constructor(private _fb: FormBuilder) {
    
  }

  ngOnInit(){
    console.log(this.form);
  }

  changePlatformList(platform: Platform){
    console.log(platform);
  }

  /*checkAll(ev) {
    this.platforms.forEach(x => x.state = ev.target.checked)
  }

  isAllChecked() {
    console.log('fired');
    return this.platforms.every(_ => _.state);
  }*/
}
