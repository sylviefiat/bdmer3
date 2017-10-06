import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Authenticate } from '../../modules/auth/models/user';

@Component({
  moduleId: module.id,
  selector: 'bc-signup-form',
  templateUrl: 'signup.component.html',
  styleUrls: [
    'login.component.css',
  ],
})
export class SignupComponent implements OnInit {
  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  @Input() errorMessage: string | null;

  @Output() submitted = new EventEmitter<Authenticate>();

  form: FormGroup = new FormGroup({
    surname: new FormControl('', Validators.required),
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    country: new FormControl('')
  });

  constructor() {}

  ngOnInit() {}

  submit() {
    if (this.form.valid) {
      console.log(this.submitted);
      this.submitted.emit(this.form.value);
    }
  }
}