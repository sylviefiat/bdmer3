import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { Country } from '../../modules/countries/models/country';


@Component({
  moduleId: module.id,
  selector: 'bt-dim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="dimForm" class="container">
    <mat-card-content>
      <mat-form-field>
        <mat-select placeholder="{{ 'SELECT_COUNTRY' | translate}}" formControlName="codeCountry" (selectionChange)="setCountry($event.value)" required>
          <mat-option *ngFor="let pays of countries" [value]="pays.code"
            [disabled]="alreadySetCountries$ | async | bcHasIntersection:pays.code:dimForm.controls.codeCountry.value">{{ pays.name }}</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-card-content>
    <mat-card-content>
      <mat-form-field>
        <input type="number" matInput placeholder="{{ 'SPECIES_DIMS_LONG_MIN' | translate }}" formControlName="longMin" required>
        <div class="hint">{{ 'SPECIES_DIMS_LONG_MIN_EX' | translate }}</div>
      </mat-form-field>
      <mat-form-field>
        <input type="number" matInput placeholder="{{ 'SPECIES_DIMS_LONG_MAX' | translate }}" formControlName="longMax">
        <div class="hint">{{ 'SPECIES_DIMS_LONG_MAX_EX2' | translate }}</div>
      </mat-form-field>
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
    mat-form-field {
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

    @Output() changeCountry = new EventEmitter<string[]>();

    ngOnInit() {
      if(this.dimForm.controls.codeCountry.value){
        this.oldCountryCode = this.dimForm.controls.codeCountry.value;
      }
    }

    setCountry(code: string){
      this.changeCountry.emit([this.oldCountryCode,code]);
      this.oldCountryCode = code;
    }

}
