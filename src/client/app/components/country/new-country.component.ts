import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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

  @Input() errorMessage: string | null;
  

  @Output() submitted = new EventEmitter<Country>();

  form: FormGroup = new FormGroup({
    pays: new FormControl(''),
    flag: new FormControl(''),
  });

  constructor(private store: Store<IAppState>, private sanitizer: DomSanitizer ) {}

  ngOnInit() {
    this.countryList$ = this.store.let(getCountryList)
      .map((countries:Country[]) => countries = countries.sort((c1,c2) => (c1.name<c2.name)?-1:((c1.name>c2.name)?1:0)));
    this.store.dispatch(new CountriesAction.LoadAction()); 
    this.countriesIds$ = this.store.let(getCountriesIdsInApp);
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
        this.form.controls.flag.setValue(data);
        this.submitted.emit(this.form.value);
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