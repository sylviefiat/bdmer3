import { Component, AfterViewChecked, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { IAppState  } from '../../modules/ngrx/index';

import { User, Country } from '../../modules/countries/models/country';
import { CountryAction } from '../../modules/countries/actions/index';

  function passwordConfirming(c: AbstractControl): any {
        if(!c.parent || !c) return;
        const pwd = c.parent.get('password');
        const cpwd= c.parent.get('repassword');
        if(!pwd || !cpwd) return ;
        if (pwd.value !== cpwd.value) {
            return { status: 'INVALID' };
      }
}

@Component({
  moduleId: module.id,
  selector: 'bc-new-user-form',
  templateUrl: 'new-user.component.html',
  styleUrls: [
    'new-user.component.css',
  ],
})
export class NewUserComponent implements OnInit, AfterViewChecked {

  @Input() country: Country;
  @Input() errorMessage: string | null;  
  @Input() user: User;
  @Input() isAdmin: boolean;
  @Output() submitted = new EventEmitter<User>();
  @Output() back = new EventEmitter<string>();

  get cpwd() {
      return this.form.get('repassword');
  }

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    repassword: new FormControl('', [Validators.required, passwordConfirming]),
    countryCode: new FormControl('', [Validators.required, passwordConfirming]),
    role: new FormControl(''),
  });

  constructor(private sanitizer: DomSanitizer ) {}

  ngOnInit(){
    console.log(this.user);
    if(this.user){
      this.form.controls.name.setValue(this.user.name);
      this.form.controls.surname.setValue(this.user.surname);
      this.form.controls.email.setValue(this.user.email);
      this.form.controls.username.setValue(this.user.username);
      this.form.controls.role.setValue(this.user.role);
      this.form.controls.password.setValue(this.user.password);
      this.form.controls.repassword.setValue(this.user.password);
    }
  }

  ngAfterViewChecked() {    
    this.form.controls['countryCode'].setValue(this.country.code);
  }

  checkPasswords(c: FormControl) {
    let repass = c.value;
    let password = this.form.controls.password.value;
    return repass === password ? null : { notSame: true }
  }

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    }
  }

  return() {
    this.back.emit(this.country.code);
  }

  get countryName() {
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