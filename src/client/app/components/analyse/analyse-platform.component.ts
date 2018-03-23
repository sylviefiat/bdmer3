import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Platform } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-analyse-platform',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form">
      
        <mat-checkbox *ngFor="let platform of platforms" 
          [formControlName]="inputName" required>
          {{ platform.code }}
        </mat-checkbox>
      
    </div>
  `,
})
export class AnalysePlatformComponent implements OnInit {
  @Input() platforms: Platform[];
  @Input() inputName: string;
  @Output() platformEmitter = new EventEmitter<Platform>();
  @Input() form: FormGroup;

  constructor(private _fb: FormBuilder) {
    
  }

  ngOnInit(){
    
  }

  changePlatformList(platform: Platform){
    console.log(platform);
  }

  checkAll(ev) {
    this.platforms.forEach(x => x.state = ev.target.checked)
  }

  isAllChecked() {
    console.log('fired');
    return this.platforms.every(_ => _.state);
  }
}
