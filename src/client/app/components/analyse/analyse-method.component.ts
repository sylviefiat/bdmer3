import { Component, OnInit,OnChanges, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Method } from '../../modules/analyse/models/index';

@Component({
  selector: 'bc-analyse-method',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ 'SELECT_METHOD' | translate }}</h2>
    <mat-form-field [formGroup]="form" *ngIf="methods.length>0">    
      <mat-select placeholder="{{ 'SELECT_METHOD' | translate}}" [(value)]="valeur" 
        (selectionChange)="methodEmitter.emit($event.value)" required>
        <mat-option *ngFor="let method of methods" [value]="method" [disabled]="methods.length===1">{{ method.method | translate }}</mat-option>
      </mat-select>
    </mat-form-field> 
      <div *ngIf="methods.length===1" class="nobiomass">{{ 'NONE_ASTERIX' | translate}}</div>
  `,

    styles: [
        `
    .nobiomass {
      color: orange;
      padding-bottom:10px;
      font-size: smaller;
      font-style: italic;
    }
    `]
})
export class AnalyseMethodComponent implements OnChanges {
  @Input() form: FormGroup;
  @Input() inputName: string;
  @Input() methods:  Method[];
  @Output() methodEmitter = new EventEmitter<Method>();
  valeur: Method;

  constructor() {
    
  }

  ngOnChanges(){    
    this.valeur = this.methods[this.methods.length-1];
    this.methodEmitter.emit(this.valeur);
  }

}
