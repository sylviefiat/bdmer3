import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter,OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Platform } from '../../modules/datas/models/index';

@Component({
    selector: 'bc-analyse-platform',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div [formGroup]="form"> 
      <h2>{{ 'SELECT_PLATFORMS' | translate }}</h2>
      <mat-checkbox (change)="checkAll($event)">
          {{ 'CHECK_ALL' | translate }}
        </mat-checkbox>
      <div  class="platforms">
        <div *ngFor="let platform of defaultPlatforms; let i=index">
          <bc-platform [group]="form.controls.platforms.controls[i]" [platform]="platform" (platformEmitter)="changeValue($event)"></bc-platform>
        </div>
      </div>
    </div>
  `,

    styles: [
        `
    .platforms {
      margin-top:10px;
      margin-bottom:10px;
      padding:5px;
      border: 1px solid grey;
    }
    `]
})
export class AnalysePlatformComponent implements OnInit, OnDestroy {
    @Input() platforms$: Observable<Platform[]>;
    defaultPlatforms: Platform[] = [];
    checkedPlatforms: Platform[] = [];
    @Output() platformEmitter = new EventEmitter<Platform[]>();
    @Input('group') public form: FormGroup;
    actionsSubscription: Subscription;

    constructor(private _fb: FormBuilder) {
        this.actionsSubscription = this.platforms$.subscribe(platforms => this.defaultPlatforms=[...platforms]);
    }

    ngOnInit() {        
        this.initPlatforms();
    }

    ngOnDestroy(){
        this.actionsSubscription.unsubscribe();
    }

    newPlatform(p: Platform) {
        return this._fb.group({
            platform: new FormControl(this.checkedPlatforms.filter(platform => platform.code === p.code).length > 0)
        });
    }

    initPlatforms() {
        this.form.controls['platforms'] = this._fb.array([]);
        for (let platform of this.defaultPlatforms) {
            const control = <FormArray>this.form.controls['platforms'];
            control.push(this.newPlatform(platform));
        }
    }

    changeValue(platCheck: any) {
        this.checkedPlatforms = [...this.checkedPlatforms.filter(p => p.code !== platCheck.platform.code)];
        if (platCheck.checked) {
            this.checkedPlatforms.push(platCheck.platform);
        }
        this.platformEmitter.emit(this.checkedPlatforms);
    }

    checkAll(ev) {
        const control = <FormArray>this.form.controls['platforms'];
        control.value.forEach(x => x.platform = ev.checked)
        control.setValue(control.value);
        this.checkedPlatforms = (ev.checked) ? this.defaultPlatforms : [];
        this.platformEmitter.emit(this.checkedPlatforms);
    }

}
