import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  moduleId: module.id,
  selector: 'bt-dim',
  template: `
    <md-card-content [formGroup]="dimForm">
    <p>
      <md-input-container>
        <input type="text" mdInput placeholder="Country code" formControlName="codeCountry" required>
        <div class="hint">Ex: FR</div>
      </md-input-container>          
    </p>
    <p> 
      <md-input-container>
        <input type="text" mdInput placeholder="Longueur minimale" formControlName="longMin" required>mm
        <div class="hint">Ex: 100</div>    
      </md-input-container>     
      <md-input-container>
        <input type="text" mdInput placeholder="Longueur maximale" formControlName="longMax" required>mm
        <div class="hint">Ex: 800</div>    
      </md-input-container>
    </p>
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
    .hint {
      /* Position the hint */
      position: absolute;
      left: 2px;
      right: auto;
      bottom: 7px;
      /* Copy styles from ng-messages */
      font-size: 12px;
      line-height: 14px;
      transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);
      /* Set our own color */
      color: grey; 
    }
  `,
  ],
})
export class DimensionsComponent {
    @Input('group')
    public dimForm: FormGroup;
}