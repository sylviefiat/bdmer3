import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  moduleId: module.id,
  selector: 'bt-dim',
  template: `
    <mat-card-content [formGroup]="dimForm">
    <p>
      <mat-input-container>
        <input type="text" matInput placeholder="Country code" formControlName="codeCountry" required>
        <div class="hint">Ex: FR</div>
      </mat-input-container>          
    </p>
    <p> 
      <mat-input-container>
        <input type="text" matInput placeholder="Longueur minimale" formControlName="longMin" required>mm
        <div class="hint">Ex: 100</div>    
      </mat-input-container>     
      <mat-input-container>
        <input type="text" matInput placeholder="Longueur maximale" formControlName="longMax" required>mm
        <div class="hint">Ex: 800</div>    
      </mat-input-container>
    </p>
    </mat-card-content>
  `,
  styles: [
    `
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    mat-input-container {
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