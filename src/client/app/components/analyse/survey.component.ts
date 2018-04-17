import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Survey } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-survey',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'survey'" (change)="change($event)">
          {{ survey.code }}
        </mat-checkbox>
    </div>
  `,
})
export class SurveyComponent {
  @Input() survey: Survey;
  @Input('group') public form: FormGroup;
  @Output() surveyEmitter = new EventEmitter<{survey:Survey,checked:boolean}>();

  constructor(private _fb: FormBuilder) {
    
  }

  change(value: any){
    return this.surveyEmitter.emit({survey:this.survey,checked:value.checked});
  }
}
