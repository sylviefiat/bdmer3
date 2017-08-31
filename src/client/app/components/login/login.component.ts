import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Authenticate } from '../../modules/auth/models/user';

@Component({
  moduleId: module.id,
  selector: 'bc-login-form',
  templateUrl: 'login.component.html',
  styleUrls: [
    'login.component.css',
  ],
})
export class LoginComponent implements OnInit {
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
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor() {}

  ngOnInit() {}

  submit() {
    if (this.form.valid) {
      console.log("hiih");
      this.submitted.emit(this.form.value);
    }
  }
}