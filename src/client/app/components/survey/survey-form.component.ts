import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Platform, Zone, Survey } from '../../modules/datas/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-survey-form',
    templateUrl: 'survey-form.component.html',
    styleUrls: [
        'survey-form.component.css',
    ],
})
export class SurveyFormComponent implements OnInit {
    @Input() platform: Platform | null;
    @Input() survey: Survey | null;
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<Survey>();

    surveyForm: FormGroup = new FormGroup({
        code: new FormControl('', Validators.required),
        codePlatform: new FormControl(''),
        dateStart: new FormControl(),
        dateEnd: new FormControl(),
        participants: new FormControl(''),
        surfaceStation: new FormControl(''),
        description: new FormControl('')
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }
    
    ngOnInit() {
        this.surveyForm.controls.codePlatform.setValue(this.platform ? this.platform.code : null);
        (this.platform !== undefined) ? this.surveyForm.controls.codePlatform.disable() : this.surveyForm.controls.codePlatform.enable();
        if(this.survey) {
            this.surveyForm.controls.code.setValue(this.survey.code);
            this.surveyForm.controls.dateStart.setValue(this.survey.dateStart);
            this.surveyForm.controls.dateEnd.setValue(this.survey.dateEnd);
            this.surveyForm.controls.participants.setValue(this.survey.participants);
            this.surveyForm.controls.surfaceStation.setValue(this.survey.surfaceStation);
            this.surveyForm.controls.description.setValue(this.survey.description);
        } else {
            this.surveyForm.controls.code.setValue(this.platform.code + "_");
        }
    }

    submit() {
        console.log(this.surveyForm);
        if (this.surveyForm.valid) {
            this.surveyForm.value.codePlatform=this.surveyForm.controls.codePlatform.value;
            this.submitted.emit(this.surveyForm.value);
        }
    }

    return() {
        let redirect = this.survey ? 'survey/'+this.platform.code+'/'+this.survey.code : '/platform/' + this.platform.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}
