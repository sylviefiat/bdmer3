import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Country } from '../../modules/countries/models/country';


@Component({
  moduleId: module.id,
  selector: 'bt-dim',
  template: `
    <div [formGroup]="dimForm" class="container">
    <mat-card-content>
      <mat-form-field>
        <mat-select placeholder="{{ 'SELECT_COUNTRY' | translate}}" formControlName="codeCountry" (change)="addSetCountry($event.value)" required>
          <mat-option *ngFor="let pays of countries" [value]="pays.code" [disabled]="alreadySetCountries$ | async | bcHasIntersection:pays.code">{{ pays.name }}</mat-option>
        </mat-select>
      </mat-form-field>         
    </mat-card-content>
    <mat-card-content> 
      <mat-input-container>
        <input type="text" matInput placeholder="{{ 'SPECIES_DIMS_LONG_MIN' | translate }}" formControlName="longMin" required>
        <div class="hint">{{ 'SPECIES_DIMS_LONG_MIN_EX' | translate }}</div>    
      </mat-input-container>     
      <mat-input-container>
        <input type="text" matInput placeholder="{{ 'SPECIES_DIMS_LONG_MAX' | translate }}" formControlName="longMax" required>
        <div class="hint">{{ 'SPECIES_DIMS_LONG_MAX_EX2' | translate }}</div>    
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
export class DimensionsComponent implements OnInit {
    @Input('group')
    public dimForm: FormGroup;
    @Input() countries: Country[];
    @Input() alreadySetCountries$: Observable<string[]>;
    oldCountryCode: string;

    ngOnInit() {
      if(this.dimForm.controls.codeCountry.value){
        this.oldCountryCode = this.dimForm.controls.codeCountry.value;
      }
    }

    addSetCountry(code: string){
      this.alreadySetCountries$ = this.alreadySetCountries$.map(countries => {
        console.log(countries);
        if(this.oldCountryCode){
          countries = countries.filter(country => country !== this.oldCountryCode);
          console.log(countries);
        }
        countries.push(code);
        console.log(countries);
        return countries;
      });
    }

}