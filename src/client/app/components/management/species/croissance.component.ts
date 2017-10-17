import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  moduleId: module.id,
  selector: 'bt-croissance',
  template: `
    <md-card-content [formGroup]="croissanceForm">
      <md-input-container>
        <input type="text" mdInput placeholder="coef A" formControlName="coefA" required>
        <div class="hint">Ex: 0.001320729</div>
      </md-input-container>
          
      <md-input-container>
        <input type="text" mdInput placeholder="coef B" formControlName="cofeB" required>
        <div class="hint">Ex: 1.3</div>    
      </md-input-container>
    </md-card-content>
  `,
  styles: [
    `
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    md-input-container {
      padding-left: 1em;
    }
    input {
      width: 300px;
    }
  `,
  ],
})
export class CroissanceComponent {
    @Input('group')
    public croissanceForm: FormGroup;
}