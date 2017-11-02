import { Component, AfterViewChecked, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { IAppState  } from '../../modules/ngrx/index';

import { User, Country } from '../../modules/countries/models/country';
import { CountryAction } from '../../modules/countries/actions/index';

@Component({
  moduleId: module.id,
  selector: 'bc-new-user-form',
  templateUrl: 'new-user.component.html',
  styleUrls: [
    'new-user.component.css',
  ],
})
export class NewUserComponent implements AfterViewChecked {

  @Input() country: Country;
  @Input() errorMessage: string | null;  

  @Output() submitted = new EventEmitter<User>();

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    countryCode: new FormControl(''),
    role: new FormControl(''),
  });

  constructor(private sanitizer: DomSanitizer ) {}

  ngAfterViewChecked() {    
    this.form.controls['countryCode'].setValue(this.country.code);
  }

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    }
  }

  get name() {
    return this.country && this.country.name;
  }

  get flag() {
    //console.log(this.country._attachments);
    if(this.country._attachments &&
      this.country._attachments.flag){
      let blob = this.country._attachments.flag;
      var file = new Blob([ blob.data ], {
        type : blob.content_type
      });
      return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))

    }    
    return null;
  }

}