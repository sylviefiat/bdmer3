import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Zone } from '../../modules/datas/models/index';

@Component({
    selector: 'bc-analyse-zone',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div [formGroup]="form"> 
      <h2>{{ 'SELECT_ZONES' | translate }}</h2>
      <mat-checkbox (change)="checkAll($event)">
          {{ 'CHECK_ALL' | translate }}
        </mat-checkbox>
      <div  class="zones">
        <div *ngFor="let zone of defaultZones; let i=index">
          <bc-zone [group]="form.controls.zones.controls[i]" [zone]="zone" (zoneEmitter)="changeValue($event)"></bc-zone>
        </div>
      </div>
    </div>
  `,

    styles: [
        `
    .zones {
      margin-top:10px;
      margin-bottom:10px;
      padding:5px;
      border: 1px solid grey;
    }
    `]
})
export class AnalyseZoneComponent implements OnInit, OnDestroy {
    @Input() zones$: Observable<Zone[]>;
    defaultZones: Zone[] = [];
    checkedZones: Zone[] = [];
    @Output() zoneEmitter = new EventEmitter<Zone[]>();
    @Input('group') public form: FormGroup;
    actionSubscription: Subscription;

    constructor(private _fb: FormBuilder) {
        
    }

    ngOnInit() {
        this.actionSubscription = this.zones$.subscribe(zones => this.defaultZones = zones);
        this.initZones();
    }

    ngOnDestroy() {
        this.actionSubscription.unsubscribe();
    }

    newZone(s: Zone) {
        return this._fb.group({
            zone: new FormControl(this.checkedZones.filter(zone => zone.properties.code === s.properties.code).length > 0)
        });
    }

    initZones() {
        if(this.defaultZones !== null){
            this.form.controls['zones'] = this._fb.array([]);
            for (let zone of this.defaultZones) {
                const control = <FormArray>this.form.controls['zones'];
                control.push(this.newZone(zone));
            }
        }
    }

    changeValue(zoneCheck: any) {
        console.log(zoneCheck);
        this.checkedZones = [...this.checkedZones.filter(z => z.properties.code !== zoneCheck.zone.properties.code)];
        if (zoneCheck.checked) {
            this.checkedZones.push(zoneCheck.zone);
        }
        this.zoneEmitter.emit(this.checkedZones);
    }

    checkAll(ev) {
        const control = <FormArray>this.form.controls['zones'];
        control.value.forEach(x => x.zone = ev.checked)
        control.setValue(control.value);
        this.checkedZones = (ev.checked) ? this.defaultZones : [];
        this.zoneEmitter.emit(this.checkedZones);
    }

}
