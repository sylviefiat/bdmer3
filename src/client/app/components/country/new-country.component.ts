import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


import { IAppState, getCountryList  } from '../../modules/ngrx/index';

import { Country, Image } from '../../modules/countries/models/country';

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
  public image: any;

  @Input() errorMessage: string | null;
  

  @Output() submitted = new EventEmitter<Country>();

  form: FormGroup = new FormGroup({
    pays: new FormControl(''),
  });

  constructor(private store: Store<IAppState>, private sanitizer: DomSanitizer ) {}

  ngOnInit() {
    this.countryList$ = this.store.let(getCountryList);
  }

  submit() {
    if (this.form.valid) {
      console.log(this.submitted);
      this.submitted.emit(this.form.value);
    }
  }

  safeUrl(flag : Observable<Image>): SafeUrl {
    //console.log(flag);
    return flag.subscribe(data => {console.log(data);return data._attachments},err=> console.log(err),() => console.log('done'));
    //return null;
  }

  get flag() {
   
    return (
      this.form.get('pays') &&
      this.form.get('pays').value &&
      this.form.get('pays').value['flag']
    );
  }
}