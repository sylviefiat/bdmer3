import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Species } from '../../modules/datas/models/index';


@Component({
  moduleId: module.id,
  selector: 'bt-mesure',
  template: `
    <div [formGroup]="mesureForm" class="container">
    <mat-card-content>
       <mat-form-field>
          <mat-select placeholder="{{'SPECIES_SELECT' | translate}}" formControlName="codeSpecies" required>
            <mat-option *ngFor="let espece of species" [value]="espece.code">{{ espece.scientificName }}</mat-option>
          </mat-select>
        </mat-form-field>  
      <mat-input-container>
        <input type="text" matInput placeholder="{{ 'SPECIES_LONG' | translate }}" formControlName="long" required>
        <div class="hint">{{ 'SPECIES_LONG_EX' | translate }}</div>    
      </mat-input-container>     
      <mat-input-container>
        <input type="text" matInput placeholder="{{ 'SPECIES_LARG' | translate }}" formControlName="larg" required>
        <div class="hint">{{ 'SPECIES_LARG_EX' | translate }}</div>    
      </mat-input-container>
    </mat-card-content>
    </div>
  `,
  styles: [
    `
    div.container {      
      background-color: #f3f3f4;
      padding-top: 10px;
    }
    mat-card-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      flex-grow: 1;
    }
    mat-input-container {
      padding-left: 2em;
      flex-grow: 1;
    }
    
    .mat-form-field {
      flex-grow: 1;
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
export class MesuresComponent {
    @Input('group')
    public mesureForm: FormGroup;
    @Input() species: Species[];
}