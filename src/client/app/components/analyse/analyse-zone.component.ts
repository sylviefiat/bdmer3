import { Observable, Subscription, of } from 'rxjs';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { LngLatBounds, LngLat, MapMouseEvent } from 'mapbox-gl';
import { MapService } from '../../modules/core/services/index';
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
            }"> 
            <ng-container *ngIf="defaultZones && (display$ | async)">
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
                              [false, '#AFEEEE'],
                              [true, '#FF0000']
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
      height: 500px;
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
    zoomMaxMap = 11;
    layerZones$: Observable<Turf.FeatureCollection>;
    display$: Observable<boolean>;

    constructor(private _fb: FormBuilder, private mapService: MapService) {
        this.display$ = of(true);
    }

    ngOnInit() {
        this.actionSubscription = this.zones$.subscribe(zones => {
            this.defaultZones = zones;
            this.initZones();
            let bounds = new LngLatBounds();
            if(this.defaultZones && this.defaultZones.length>0){
              let lz = Turf.featureCollection(this.defaultZones.map(zone => this.getFeature(zone,false)));
              this.layerZones$ = of(lz);
              if (this.defaultZones.length > 0) {              
                  this.bounds$ = of(MapService.zoomToZones(lz));
              }
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

    select(evt: MapMouseEvent) {
        this.display$ = of(false);
        let selected = (<any>evt).features[0].properties;
        this.changeMapSelection(selected.code);
        this.changeFormSelected(selected.code);
        this.changeCheckedZones(selected.code);
    }

    changeValue(zoneCheck: any) {
        this.display$ = of(false);
        this.changeMapSelection(zoneCheck.zone.properties.code);
        this.changeCheckedZones(zoneCheck.zone.properties.code);
    }

    changeCheckedZones(code) {
        if (this.checkedZones.map(zone => zone.properties.code).filter(c => c === code).length > 0) {
            this.checkedZones = [...this.checkedZones.filter(z => z.properties.code !== code)];
        } else {
            this.checkedZones.push(this.defaultZones.filter(zone => zone.properties.code === code)[0]);
        }
        this.zoneEmitter.emit(this.checkedZones);
    }

    changeFormSelected(code) {
        const control = <FormArray>this.form.controls['zones'];
        control.value.forEach((x, i) => {
            if (i === this.defaultZones.map(zone => zone.properties.code).indexOf(code)) {
                x.zone = x.zone ? 0 : 1;
            }
            return x.zone;
        });
        control.setValue(control.value);
    }

    changeMapSelection(code) {
        let checked = this.checkedZones.map(zone => zone.properties.code).filter(c => c === code).length > 0 ? false : true;
        this.layerZones$ = of(Turf.featureCollection(this.defaultZones.map(zone => {
            let checked = this.checkedZones.map(z => z.properties.code).filter(c => c === zone.properties.code).length > 0 ? true : false;
            checked = (zone.properties.code === code) ? !checked : checked;
            return this.getFeature(zone,checked);
        })));
        this.display$ = of(true);
    }

    checkAll(ev) {
        const control = <FormArray>this.form.controls['zones'];
        control.value.forEach(x => x.zone = ev.checked)
        control.setValue(control.value);
        this.checkedZones = (ev.checked) ? this.defaultZones : [];
        this.layerZones$ = of(Turf.featureCollection(this.defaultZones.map(zone => this.getFeature(zone,ev.checked))));
        this.zoneEmitter.emit(this.checkedZones);
    }

    getFeature(feature,checked) {
      return MapService.getFeature(feature,{ code: feature.properties.code, checked: checked });
    }

}
