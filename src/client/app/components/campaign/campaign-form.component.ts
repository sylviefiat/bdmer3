import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState, getSpeciesInApp } from '../../modules/ngrx/index';

import { Site, Zone, Campaign } from '../../modules/datas/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-campaign-form',
    templateUrl: 'campaign-form.component.html',
    styleUrls: [
        'campaign-form.component.css',
    ],
})
export class CampaignFormComponent implements OnInit {
    @Input() site: Site | null;
    @Input() campaign: Campaign | null;
    @Input() errorMessage: string;

    @Output() submitted = new EventEmitter<Campaign>();

    campaignForm: FormGroup = new FormGroup({
        code: new FormControl('', Validators.required),
        codeSite: new FormControl(''),
        dateStart: new FormControl(),
        dateEnd: new FormControl(),
        participants: new FormControl(''),
        surfaceTransect: new FormControl(''),
        description: new FormControl('')
    });

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private _fb: FormBuilder) { }
    
    ngOnInit() {
        this.campaignForm.controls.codeSite.setValue(this.site ? this.site.code : null);
        (this.site !== undefined) ? this.campaignForm.controls.codeSite.disable() : this.campaignForm.controls.codeSite.enable();
        if(this.campaign) {
            this.campaignForm.controls.code.setValue(this.campaign.code);
            this.campaignForm.controls.dateStart.setValue(this.campaign.dateStart);
            this.campaignForm.controls.dateEnd.setValue(this.campaign.dateEnd);
            this.campaignForm.controls.participants.setValue(this.campaign.participants);
            this.campaignForm.controls.surfaceTransect.setValue(this.campaign.surfaceTransect);
            this.campaignForm.controls.description.setValue(this.campaign.description);
        } else {
            this.campaignForm.controls.code.setValue(this.site.code + "_");
        }
    }

    submit() {
        console.log(this.campaignForm);
        if (this.campaignForm.valid) {
            this.campaignForm.value.codeSite=this.campaignForm.controls.codeSite.value;
            this.submitted.emit(this.campaignForm.value);
        }
    }

    return() {
        let redirect = this.campaign ? 'campaign/'+this.site.code+'/'+this.campaign.code : '/site/' + this.site.code;
        this.routerext.navigate([redirect], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

}
