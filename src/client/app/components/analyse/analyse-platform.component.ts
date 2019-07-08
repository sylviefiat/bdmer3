import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter,OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

@Component({
    selector: 'bc-analyse-platform',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div [formGroup]="form"> 
      <h2>{{ 'SELECT_PLATFORMS' | translate }}<span *ngIf="!isBoatType()">*</span></h2>
      <div class="norecord">{{ 'PLATFORM_NO_DATA' | translate }}</div>
      <div class="comment" *ngIf="!isBoatType()">*{{ 'PLATFORM_SELECT_ONE' | translate }}</div>
      <mat-checkbox *ngIf="isBoatType()" (change)="checkAll($event)">
          {{ 'CHECK_ALL' | translate }}
        </mat-checkbox>
      <div class="platforms">
        <div *ngFor="let platform of (platforms$ | async); let i=index">
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
    .norecord, .comment {
      color: orange;
      padding-bottom:10px;
      font-size: smaller;
      font-style: italic;
    }
    .comment {
        color: darkgrey;
    }
    `]
})
export class AnalysePlatformComponent implements OnInit, OnDestroy {
    @Input() currentCountry: Country;
    @Input() platforms$: Observable<Platform[]>;
    defaultPlatforms: Platform[] = [];
    checkedPlatforms: Platform[] = [];
    @Output() platformEmitter = new EventEmitter<Platform[]>();
    @Input('group') public form: FormGroup;
    actionsSubscription: Subscription;

    constructor(private _fb: FormBuilder) {
        
    }

    ngOnInit() {  
        this.actionsSubscription = this.platforms$.subscribe(platforms => {
            this.defaultPlatforms=platforms;
            this.initPlatforms();
        });      
        
    }

    ngOnDestroy(){
        this.actionsSubscription.unsubscribe();
    }

    isBoatType(){
        return this.currentCountry && this.currentCountry.platformType === 1;
    }

    newPlatform(p: Platform) {
        return this._fb.group({
            platform: new FormControl({
                value: this.checkedPlatforms.filter(platform => platform.code === p.code).length > 0, 
                disabled: !(p.zones.length > 0 && p.surveys.length > 0 && p.stations.length > 0 && 
                    (<any>p.surveys).flatMap(s => s.counts).length > 0)
            })
        });
    }

    initPlatforms() {
        if(this.defaultPlatforms !== null){
            this.form.controls['platforms'] = this._fb.array([]);
            for (let platform of this.defaultPlatforms) {
                const control = <FormArray>this.form.controls['platforms'];
                control.push(this.newPlatform(platform));
            }
        }
    }

    changeValue(platCheck: any) {
        if(this.isBoatType()){
            this.checkedPlatforms = [...this.checkedPlatforms.filter(p => p.code !== platCheck.platform.code)];
        } else {
            this.checkedPlatforms = [];            
        }
        if (platCheck.checked) {
            this.checkedPlatforms.push(platCheck.platform);
        }
        this.platformEmitter.emit(this.checkedPlatforms);
    }

    checkAll(ev) {
        const control = <FormArray>this.form.controls['platforms'];
        control.controls.forEach((x,i) => {
            if(!x.disabled){
                x.value.platform = ev.checked;
                if(ev.checked){
                    this.checkedPlatforms = [...this.checkedPlatforms.filter(cp => cp.code !== this.defaultPlatforms[i].code),this.defaultPlatforms[i]];
                } else {
                    this.checkedPlatforms = [...this.checkedPlatforms.filter(cp => cp.code !== this.defaultPlatforms[i].code)];
                }
                control.setControl(i,x);
            }
        })
        //control.value.forEach(x => x.platform = ev.checked);
        //control.setControl (control.controls);
       // control.setValue(control.value);
        //this.checkedPlatforms = (ev.checked) ? this.defaultPlatforms : [];
        this.platformEmitter.emit(this.checkedPlatforms);
    }

}
