import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  moduleId: module.id,
  selector: 'bt-name',
  template: `
    <mat-card-content [formGroup]="nameForm">
      <mat-input-container>
        <input type="text" matInput placeholder="Code language" formControlName="lang" required>
        <div class="hint">Ex: FR</div>
      </mat-input-container>
          
      <mat-input-container>
        <input type="text" matInput placeholder="Nom vernaculaire" formControlName="name" required>
        <div class="hint">Ex: Holothurie brune</div>    
      </mat-input-container>
    </mat-card-content>
  `,
  styles: [
    `
    mat-card-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      background-color: #f3f3f4;
      padding-top: 10px;
    }
    mat-input-container {
      padding-left: 2em;
      flex-grow: 1;
    }
    
    .mat-form-field {
      width: auto;
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
export class NameComponent {
    @Input('group')
    public nameForm: FormGroup;
}