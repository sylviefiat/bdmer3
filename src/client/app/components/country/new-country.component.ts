import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { defer, Observable, pipe, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { mergeMap } from 'rxjs/operators';

import { IAppState, getCountryList, getCountriesIdsInApp  } from '../../modules/ngrx/index';

import { CountriesAction } from '../../modules/countries/actions/index';
import { Country } from '../../modules/countries/models/country';

@Component({
  moduleId: module.id,
  selector: 'bc-new-country-form',
  templateUrl: 'new-country.component.html',
  styleUrls: [
    'new-country.component.css',
  ],
})
export class NewCountryComponent implements OnInit {
  public countryList$: Observable<any[]>;
  public countriesIds$: Observable<any[]>;
  public image: any;
  results: any[];
  @Input() errorMessage: string | null;
  

  @Output() submitted = new EventEmitter<Country>();

  form: FormGroup = new FormGroup({
    pays: new FormControl(''),
    flag: new FormControl(''),
    coordinates: new FormGroup({
      lat: new FormControl(),
      lng: new FormControl()
    })
  });

  constructor(private http: HttpClient, private store: Store<IAppState>, private sanitizer: DomSanitizer ) {}

  ngOnInit() {
    this.countryList$ = this.store.select(getCountryList).pipe(
      mergeMap((countries:any[]) => countries = countries.sort((c1,c2) => (c1.name<c2.name)?-1:((c1.name>c2.name)?1:0))));
    this.store.dispatch(new CountriesAction.LoadAction()); 
    this.countriesIds$ = this.store.select(getCountriesIdsInApp);
  }

  svgToB64(){
      const url = '../node_modules/svg-country-flags/svg/' + this.form.value.pays.code.toLowerCase() + '.svg';
      return new Promise((resolve) =>{
        var ajax = new XMLHttpRequest();
        ajax.open("GET", url, true);
        ajax.send();
        ajax.onload = () => resolve("data:image/svg+xml;base64," + window.btoa(ajax.responseText))
      })
  }

  submit() {
    if (this.form.valid) {
      this.svgToB64().then( (data) => {
        this.http.get('http://maps.googleapis.com/maps/api/geocode/json?address='+ this.form.controls.pays.value["name"] +'&sensor=false&apiKey=AIzaSyBSEMJ07KVIWdyD0uTKaO75UYsIMMCi69w')
          .subscribe(coord => {
            this.form.controls.coordinates.get("lat").setValue(coord["results"]["0"].geometry.location.lat);
            this.form.controls.coordinates.get("lng").setValue(coord["results"]["0"].geometry.location.lng);
            this.form.controls.flag.setValue(data);

            this.submitted.emit(this.form.value);
        });
        });
    }
  }

  get flag() {
    return (
      this.form.get('pays') &&
      this.form.get('pays').value &&
        this.form.get('pays').value['flag']
    )
  }
}