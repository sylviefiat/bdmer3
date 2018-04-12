import { Observable } from 'rxjs/Observable';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Platform } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-analyse-platform',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
      <div *ngFor="let platform of platforms$ | async; let i=index">
        <bc-platform [group]="form.controls.platforms.controls[i]" [platform]="platform" (platformEmitter)="changeValue($event)"></bc-platform>
      </div>
    </div>
  `,
})
export class AnalysePlatformComponent implements OnInit {
  @Input() platforms$: Observable<Platform[]>;
  checkedPlatforms: Platform[] = [];
  @Output() platformEmitter = new EventEmitter<Platform>();
  @Input('group') public form: FormGroup;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {
    this.initPlatforms();
  }

  newPlatform(p: Platform) {
    return this._fb.group({
      platform: new FormControl(this.checkedPlatforms.filter(platform => platform.code === p.code).length > 0)
    });
  }

  initPlatforms() {
    this.platforms$
      .filter(platforms => platforms !== null)
      .subscribe(platforms => {
        this.form.controls['platforms'] = this._fb.array([]);
        for (let platform of platforms) {
          const control = <FormArray>this.form.controls['platforms'];
          control.push(this.newPlatform(platform));
        }
      })
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
