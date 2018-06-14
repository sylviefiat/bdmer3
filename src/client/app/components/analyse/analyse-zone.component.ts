import { Observable, Subscription, of } from 'rxjs';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { LngLatBounds,LngLat,MapMouseEvent } from 'mapbox-gl';
import * as Turf from '@turf/turf';
import { Zone } from '../../modules/datas/models/index';

@Component({
    selector: 'bc-analyse-zone',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div [formGroup]="form"> 
      <h2>{{ 'SELECT_ZONES' | translate }}</h2>
      <div class="row">
          <div class="half">
              <mat-checkbox (change)="checkAll($event)">
                {{ 'CHECK_ALL' | translate }}
              </mat-checkbox>
              <div  class="zones">
                <div *ngFor="let zone of (zones$ | async); let i=index">
                  <bc-zone [group]="form.controls.zones.controls[i]" [zone]="zone" (zoneEmitter)="changeValue($event)"></bc-zone>
                </div>
              </div>
          </div>
          <mgl-map
            [style]="'mapbox://styles/mapbox/satellite-v9'"
            [fitBounds]="bounds$ | async"
            [fitBoundsOptions]="{
              padding: boundsPadding,
              maxZoom: zoomMaxMap
            }"
            (data)="styleChange($event)"> 
            <ng-container *ngIf="defaultZones && display">
                <mgl-geojson-source 
                  id="layerZones"
                  [data]="layerZones$ | async">
                </mgl-geojson-source>
                <mgl-layer
                    id="zones"
                    type="fill"
                    source="layerZones"
                    [paint]="{
                      'fill-color': {
                          property: 'checked',
                          type: 'categorical',
                          stops: [
                              [0, '#AFEEEE'],
                              [1, '#FF0000']
                          ]
                      },
                      'fill-opacity': 0.3,
                      'fill-outline-color': '#FFF'
                    }"
                    (click)="select($event)">            
                </mgl-layer>
                <mgl-layer
                    id="zones-text"
                    type="symbol"
                    source="layerZones"
                    [layout]="{
                      'text-field': '{code}',
                      'text-anchor':'bottom',
                      'text-font': [
                        'DIN Offc Pro Italic',
                        'Arial Unicode MS Regular'
                      ],
                      'symbol-placement': 'point',
                      'symbol-avoid-edges': true,
                      'text-max-angle': 30,
                      'text-size': 12
                    }"  
                    [paint]="{
                      'text-color': 'white'
                    }"
                  >            
                  </mgl-layer>
            </ng-container>
          </mgl-map>
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
    .row{
      display:flex;
    }
    .half {
      width:50%;
    }
    mgl-map {
      height: 250px;
      width: 50%;
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
    bounds$: Observable<LngLatBounds>;
    boundsPadding: number = 50;
    zoomMaxMap=11;
    layerZones$: Observable<Turf.FeatureCollection>;
    display:boolean=true;

    constructor(private _fb: FormBuilder) {

    }

    ngOnInit() {
        this.actionSubscription = this.zones$.subscribe(zones => {
            this.defaultZones = zones;
            this.initZones();
            let bounds = new LngLatBounds();
            this.layerZones$ = of(Turf.featureCollection(this.defaultZones.map(zone => Turf.polygon(zone.geometry.coordinates,{code: zone.properties.code,checked: 0}))));
            if(this.defaultZones.length >0){
                let coord0 = this.defaultZones[0].geometry.coordinates[0][0];
                let bounds = this.defaultZones.map(z => z.geometry.coordinates[0][0]).reduce((bnd, coord) => {                    
                        return bnd.extend(<any>coord);    
                }, new LngLatBounds(coord0, coord0));
                this.bounds$=of(bounds);
            }
        });

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
        if (this.defaultZones !== null) {
            this.form.controls['zones'] = this._fb.array([]);
            for (let zone of this.defaultZones) {
                const control = <FormArray>this.form.controls['zones'];
                control.push(this.newZone(zone));
            }
        }
    }

    select(evt: MapMouseEvent){
        console.log((<any>evt).features[0]);
        let selected = (<any>evt).features[0].properties;
        this.changeMapSelection(selected.code);
        this.changeFormSelected(selected.code);
        this.changeCheckedZones(selected.code);
        this.display=true;
    }

    changeValue(zoneCheck: any) {
        console.log(zoneCheck);        
        this.changeMapSelection(zoneCheck.zone.properties.code);
        this.changeCheckedZones(zoneCheck.zone.properties.code);
        this.display=true;
    }

    changeCheckedZones(code){
        console.log(code);
        if (this.checkedZones.map(zone=>zone.properties.code).filter(c=>c===code).length>0) {
            this.checkedZones = [...this.checkedZones.filter(z => z.properties.code !== code)];
        } else {
            console.log(this.defaultZones);
            this.checkedZones.push(this.defaultZones.filter(zone=>zone.properties.code===code)[0]);
        }
        console.log(this.checkedZones);
        this.zoneEmitter.emit(this.checkedZones);
    }

    changeFormSelected(code){
        const control = <FormArray>this.form.controls['zones'];
        control.value.forEach((x,i) => {
            if(i===this.defaultZones.map(zone=>zone.properties.code).indexOf(code)){
                x.zone = x.zone ? 0:1;
            }
            return x.zone;
        });
        control.setValue(control.value);
    }

    changeMapSelection(code) {
        this.layerZones$=this.layerZones$.map(lz => {
            Turf.flattenEach(lz,(zone,index)=>{
                if(zone.properties.code===code){
                    zone.properties.checked=zone.properties.checked?0:1;
                }
            });
            console.log(lz);
            return lz;
        }); 
        this.display=false;       
    }

    styleChange(event){
        //console.log(event);
    }

    checkAll(ev) {
        const control = <FormArray>this.form.controls['zones'];
        control.value.forEach(x => x.zone = ev.checked)
        control.setValue(control.value);
        this.checkedZones = (ev.checked) ? this.defaultZones : [];
        this.zoneEmitter.emit(this.checkedZones);
    }

}
