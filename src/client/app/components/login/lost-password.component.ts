import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Authenticate } from '../../modules/auth/models/user';

@Component({
  moduleId: module.id,
  selector: 'bc-lost-password-form',
  template: `
    <md-card>
      <md-card-title>Recover password</md-card-title>
      <md-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <p>
            <fa [name]="'mail-o'" [border]=false [size]=2></fa>
            <md-input-container>
              <input type="text" mdInput placeholder="Email" formControlName="email">
            </md-input-container>
          </p>
          
          <p *ngIf="errorMessage" class="mailError">
            {{ errorMessage }}
          </p> 
          <p class="lostPasswordButton">
            <button type="submit" md-button>Send me my password</button>
          </p>
        </form>
      </md-card-content>

    </md-card>

  `,
  styles: [
    `
    :host {
      display: flex;
      justify-content: center;
      margin: 75px 0;
    }
    md-card {
      max-width: 600px;
      min-width: 400px;
      min-height: 300px;
      margin: 15px;
    }
    md-card-title-group {
      margin-left: 0;
    }
    md-card-content {
      margin: 15px 0 50px;
    }
    md-card-actions {
      margin: 25px 0 0 !important;
    }
    md-card-footer {
      padding: 0 25px 25px;
      position: relative;
    }
  `,
  ],
})
export class LostPasswordComponent implements OnInit {
  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  @Input() errorMessage: string | null;

  @Output() submitted = new EventEmitter<string>();

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
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