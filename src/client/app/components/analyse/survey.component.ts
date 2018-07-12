import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Survey } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-survey',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
        <mat-checkbox [formControlName]="'survey'" (change)="change($event)">  
          <mat-card>
            <mat-card-title-group>
              <mat-card-title>{{ survey.code }}</mat-card-title>
              <mat-card-subtitle>{{ survey.codePlatform }}</mat-card-subtitle>
            </mat-card-title-group>
            <mat-card-content>
              {{ survey.dateStart | date:localDate }}, {{ survey.dateEnd | date:localDate }}
            </mat-card-content>
         <!--
           <mat-card-content>
              <p>{{'PARTICIPANTS' | translate}}: {{ survey.participants }}</p>
              <p>{{'SURFACE_STATION' | translate}}: {{ survey.surfaceStation }}</p>
              <p *ngIf="description">{{'DESCRIPTION' | translate}}: {{ description }}</p>
           </mat-card-content>
         -->
          </mat-card>
        </mat-checkbox>
    </div>
  `,
  styles: [
  `
    mat-card {
      max-width: 200px;
      height: auto;
    }
    mat-card-content {
      white-space:normal;      
    }
  `]
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
