import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { IAppState, getCountryList, getCountriesIdsInApp  } from '../../modules/ngrx/index';

import { CountriesAction } from '../../modules/countries/actions/index';
import { Country, Flagimg } from '../../modules/countries/models/country';

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
  });

  constructor(private store: Store<IAppState>, private sanitizer: DomSanitizer ) {}

  ngOnInit() {
    this.countryList$ = this.store.let(getCountryList);
    this.store.dispatch(new CountriesAction.LoadAction()); 
    this.countriesIds$ = this.store.let(getCountriesIdsInApp);
    console.log("herer");
  }

  submit() {
    if (this.form.valid) {
      console.log(this.submitted);
      this.submitted.emit(this.form.value);
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