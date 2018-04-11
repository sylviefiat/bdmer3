import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Platform } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-analyse-platform',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
      <div *ngFor="let platform of platforms; let i=index">
        <bc-platform [group]="form.controls.platforms.controls[i]" [platform]="platform" (platformEmitter)="changeValue($event)"></bc-platform>
      </div>
    </div>
  `,
})
export class AnalysePlatformComponent implements OnInit, AfterContentChecked {
  @Input() platforms: Platform[];
  @Input() inputName: string;
  @Output() platformEmitter = new EventEmitter<Platform>();
  @Input('group') public form: FormGroup;

  constructor(private _fb: FormBuilder) {
    
  }

  ngOnInit(){}

  ngAfterContentChecked(){
    /*this.form.controls['platforms']=this._fb.array([]);
    const control = <FormArray>this.form.controls['platforms'];
    for(let i in this.platforms){
      const addrCtrl = this.newPlatform(i);
      control.push(addrCtrl);
    }
    console.log(this.form.controls['platforms']);*/
  }

  newPlatform(platformName: string) {
    /*return this._fb.group({
      platform : new FormControl()
    });*/
  }

  changePlatformList(platform: Platform){
    console.log(platform);
  }

  changeValue(bool: any) {
        console.log(bool);
    }

  /*checkAll(ev) {
    this.platforms.forEach(x => x.state = ev.target.checked)
  }

  isAllChecked() {
    console.log('fired');
    return this.platforms.every(_ => _.state);
  }*/
}
