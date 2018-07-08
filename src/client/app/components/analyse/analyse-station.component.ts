import { Observable, Subscription, of } from 'rxjs';
import { Component, OnInit, OnChanges, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import * as Turf from '@turf/turf';
import { MapService } from '../../modules/core/services/index';
import { LngLatBounds, LngLat, MapMouseEvent } from 'mapbox-gl';
import { Station, Zone } from '../../modules/datas/models/index';

@Component({
    selector: 'bc-analyse-station',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div [formGroup]="form"> 
      <h2>{{ 'SELECT_STATIONS' | translate }}</h2>
      <div class="row">
          <div class="half">
              <mat-checkbox (change)="checkAll($event)" checked="true">
                  {{ 'CHECK_ALL' | translate }}
                </mat-checkbox>
              <div  class="stations">
                <div *ngFor="let station of (stations$ | async); let i=index">
                  <bc-station [group]="form.controls.stations.controls[i]" [station]="station" (stationEmitter)="changeValue($event)"></bc-station>
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
            <ng-container *ngIf="usedZones$ | async">
                <mgl-geojson-source 
                  id="layerZones"
                  [data]="layerZones$ | async">
                </mgl-geojson-source>
                <mgl-layer
                    id="zones"
                    type="fill"
                    source="layerZones"
                    [paint]="{
                      'fill-color': '#FF0000',
                      'fill-opacity': 0.3,
                      'fill-outline-color': '#FFF'
                    }">            
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
            <ng-container *ngIf="(layerStations$ | async) && (display$ | async)">
                <mgl-geojson-source 
                  id="layerStations"
                  [data]="layerStations$ | async">
                  <mgl-layer
                    id="stationsid"
                    type="symbol"
                    source="layerStations"
                    [layout]="{
                      'icon-image': {
                          property: 'checked',
                          type: 'categorical',
                          stops: [
                              [false, 'triangle-stroked-15'],
                              [true, 'triangle-15']
                          ]
                      },
                      'icon-size': 1.5,
                      'icon-rotate': 180,
                      'icon-allow-overlap': true,
                      'icon-ignore-placement': true
                      }"            
                    (click)="selectStation($event)"
                    (mouseEnter)="cursorStyle = 'pointer'"
                    (mouseLeave)="cursorStyle = ''">
                  </mgl-layer>        
                </mgl-geojson-source>
            </ng-container>
          </mgl-map>
      </div>
    </div>
  `,

    styles: [
        `
    .stations {
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
export class AnalyseStationComponent implements OnInit {
    @Input('group') public form: FormGroup;
    @Input() usedZones$: Observable<Zone[]>;
    @Input() stations$: Observable<Station[]>;
    @Output() stationEmitter = new EventEmitter<Station[]>();
    defaultStations: Station[] = [];
    checkedStations: Station[] = [];
    layerZones$: Observable<Turf.FeatureCollection>;
    layerStations$: Observable<Turf.FeatureCollection>;
    bounds$: Observable<LngLatBounds>;
    display$:Observable<boolean>;
    boundsPadding: number = 50;
    zoomMaxMap = 11;
    stationsSubscription: Subscription;
    zonesSubscription: Subscription;

    constructor(private _fb: FormBuilder) {

    }

    ngOnInit() {
        this.display$=of(true);
        this.stationsSubscription = this.stations$.subscribe(stations => {
            if(this.defaultStations.length===0 || this.defaultStations.length !== stations.length){
                this.defaultStations = stations;
                this.checkedStations = this.defaultStations;
                this.initStations();
                if(stations && stations.length > 0){
                    this.layerStations$ = of(Turf.featureCollection(stations.map(station => Turf.point(station.geometry.coordinates,{code: station.properties.code, checked: true}))));
                }
            }
        });
        this.zonesSubscription = this.usedZones$.subscribe(zones => {
            let bounds = new LngLatBounds();            
            if (zones && zones.length > 0) {
                this.layerZones$ = of(Turf.featureCollection(zones.map(zone => MapService.getPolygon(zone, { code: zone.properties.code }))));
                let coord0 = this.getFirstCoord(zones[0]);
                let bounds = zones.map(z => this.getFirstCoord(z)).reduce((bnd, coord) => {
                    return bnd.extend(<any>coord);
                }, new LngLatBounds(coord0, coord0));
                this.bounds$ = of(bounds);
            }
        });
        

    }

    getFirstCoord(feature){
      switch (feature.geometry.type) {
        case "GeometryCollection":
          return feature.geometry.geometries[0].coordinates[0][0];
        case "Polygon":
        default:
          return feature.geometry.coordinates[0][0];
      }
    }

    ngOnDestroy() {
        this.stationsSubscription.unsubscribe();
        this.zonesSubscription.unsubscribe();
    }

    newStation(t: Station) {
        return this._fb.group({
            station: new FormControl(this.checkedStations.filter(station => station.properties.code === t.properties.code).length > 0)
        });
    }

    initStations() {
        if (this.defaultStations !== null) {
            this.form.controls['stations'] = this._fb.array([]);
            for (let station of this.defaultStations) {
                const control = <FormArray>this.form.controls['stations'];
                control.push(this.newStation(station));
                control.value.forEach(x => x.station = true)
                control.setValue(control.value);
            }
        }
    }

    selectStation(evt: MapMouseEvent){
        this.display$=of(false);
        let selected = (<any>evt).features[0].properties;
        this.changeMapSelection(selected.code);
        this.changeFormSelected(selected.code);
        this.changeCheckedStations(selected.code);
    }

    changeValue(stationCheck: any) {
        this.display$=of(false);
        this.changeMapSelection(stationCheck.station.properties.code);
        this.changeCheckedStations(stationCheck.station.properties.code);
    }

    changeCheckedStations(code){
        if (this.checkedStations.map(station=>station.properties.code).filter(c=>c===code).length>0) {
            this.checkedStations = [...this.checkedStations.filter(s => s.properties.code !== code)];
        } else {
            this.checkedStations.push(this.defaultStations.filter(station=>station.properties.code===code)[0]);
        }
        this.stationEmitter.emit(this.checkedStations);
    }

    changeFormSelected(code){
        const control = <FormArray>this.form.controls['stations'];
        control.value.forEach((x,i) => {
            if(i===this.checkedStations.map(station=>station.properties.code).indexOf(code)){
                x.station = x.station ? 0:1;
            }
            return x.station;
        });
        control.setValue(control.value);
    }

    changeMapSelection(code) {  
        let checked = this.checkedStations.map(station => station.properties.code).filter(c => c===code).length>0?false:true;
        this.layerStations$=of(Turf.featureCollection(this.defaultStations.map(station => {
            let checked = this.checkedStations.map(z => z.properties.code).filter(c => c===station.properties.code).length>0?true:false;
            checked = (station.properties.code===code)?!checked:checked;
            return Turf.point(station.geometry.coordinates,{code: station.properties.code,checked: checked});
        })));
        this.display$=of(true);
    }

    checkAll(ev){
        return this.checkItAll(ev.checked);
    }

    checkItAll(checked: boolean) {
        const control = <FormArray>this.form.controls['stations'];
        control.value.forEach(x => x.station = checked)
        control.setValue(control.value);
        this.checkedStations = (checked) ? this.defaultStations : [];
        this.layerStations$ = of(Turf.featureCollection(this.defaultStations.map(station => Turf.point(station.geometry.coordinates,{code: station.properties.code, checked: checked}))));
        this.stationEmitter.emit(this.checkedStations);
    }

}
