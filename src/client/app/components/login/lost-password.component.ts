import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Authenticate } from '../../modules/auth/models/user';

@Component({
  moduleId: module.id,
  selector: 'bc-lost-password-form',
  template: `
    <mat-card>
      <mat-card-title>Recover password</mat-card-title>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <p>
            <fa [name]="'mail-o'" [border]=false [size]=2></fa>
            <mat-form-field>
              <input type="text" matInput placeholder="Email" formControlName="email">
            </mat-form-field>
          </p>
          
          <p *ngIf="errorMessage" class="mailError">
            {{ errorMessage }}
          </p> 
          <p class="lostPasswordButton">
            <button type="submit" mat-button>Send me my password</button>
          </p>
        </form>
      </mat-card-content>

    </mat-card>

  `,
  styles: [
    `
    :host {
      display: flex;
      justify-content: center;
      margin: 75px 0;
    }
    mat-card {
      max-width: 600px;
      min-width: 400px;
      min-height: 300px;
      margin: 15px;
    }
    mat-card-title-group {
      margin-left: 0;
    }
    mat-card-content {
      margin: 15px 0 50px;
    }
    mat-card-actions {
      margin: 25px 0 0 !important;
    }
    mat-card-footer {
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
      this.submitted.emit(this.form.value);
    }
  }
}