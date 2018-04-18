import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Survey } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-survey',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'survey'" (change)="change($event)">  
          <strong>{{ survey.code }}</strong> <br/>         
          {{ 'DATE_START' | translate }}: {{ survey.dateStart  | date:localDate }},
          {{ 'DATE_END' | translate }}: {{ survey.dateEnd  | date:localDate }} <br/>
          {{ 'PARTICIPANTS' | translate }}:{{ survey.participants }}
        </mat-checkbox>
    </div>
  `,
})
export class SurveyComponent {
  @Input() survey: Survey;
  @Input() locale: string;
  @Input() index: number;
  @Input('group') public form: FormGroup;
  @Output() surveyEmitter = new EventEmitter<{survey:Survey,checked:boolean}>();

  constructor(private _fb: FormBuilder) {
    
  }

  change(value: any){
    return this.surveyEmitter.emit({survey:this.survey,checked:value.checked});
  }


    get localDate() {
        switch (this.locale) {
            case "fr":
                return 'dd-MM-yyyy';
            case "en":
            default:
                return 'MM-dd-yyyy';
        }
    }
}
