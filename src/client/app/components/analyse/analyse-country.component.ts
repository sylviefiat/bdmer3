import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { LngLatBounds } from 'mapbox-gl';
import { Country } from '../../modules/countries/models/country';

@Component({
  selector: 'bc-analyse-country',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ 'SELECT_COUNTRY' | translate }}</h2>
    <div class='row'>
      <div class="half">
        <mat-form-field [formGroup]="form">    
          <mat-select placeholder="{{ 'SELECT_COUNTRY' | translate}}" [formControlName]="inputName" (selectionChange)="select($event.value)" required>
            <mat-option *ngFor="let pays of countries" [value]="pays">{{ pays.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <mgl-map
        [style]="'mapbox://styles/mapbox/satellite-v9'"
        [fitBounds]="bounds$ | async"
        [fitBoundsOptions]="{
          padding: boundsPadding,
          maxZoom: zoomMaxMap
        }"> 
        <ng-container *ngIf="countries">
          <mgl-marker *ngFor="let country of countries"
            [lngLat]="[country.coordinates.lng, country.coordinates.lat]">
            <div
              (click)="select(country)"
              class="marker" [class.selected]="selected?selected.code===country.code:false">
              <fa [name]="'map-marker'" [border]=false [size]=3></fa><br/>
              <span>{{country.name}}</span>
            </div>
          </mgl-marker>
        </ng-container>    
      </mgl-map>
    </div>
  `,
  styles: [
    `    
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
    .marker{
      color:white;
    }
    .marker.selected{
      color:red;
    }
    `]
})
export class AnalyseCountryComponent implements OnInit {
  @Input() countries: Country[];
  @Input() form: FormGroup;
  @Input() inputName: string;
  @Output() countryEmitter = new EventEmitter<Country>();
  selected: Country;
  bounds$: Observable<LngLatBounds>;
  boundsPadding: number = 100;
  zoomMaxMap=11;

  constructor() {
  }

  ngOnInit(){
    let coor0 = [this.countries[0].coordinates.lng,this.countries[0].coordinates.lat];
    let bounds=this.countries.map(country => ([country.coordinates.lng,country.coordinates.lat])).reduce((bnd, coord) => {
      return bnd.extend(<any>coord);
    }, new LngLatBounds(coor0, coor0));
    this.bounds$=of(bounds);
  }

  select(c: any){
    const control = <FormArray>this.form.controls[this.inputName];
    control.setValue(c);
    this.selected=c;
    return this.countryEmitter.emit(c);
  }

}
