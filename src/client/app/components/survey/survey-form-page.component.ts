import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform, Zone, Survey } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getSelectedZone, getSelectedSurvey } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-survey-page',
  template: `
    <bc-survey-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [platform]="platform$ | async"
      [survey]="survey$ | async">
    </bc-survey-form>
  `,
  styles: [
    `
    mat-card {
      text-align: center;
    }
    mat-card-title {
      display: flex;
      justify-content: center;
    }
    `]
})
export class SurveyFormPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  platform$: Observable<Platform>;
  survey$: Observable<Survey>;
  platformSubscription: Subscription;
  surveySubscription: Subscription;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute,) {
    this.platformSubscription = route.params
      .map(params => new PlatformAction.SelectPlatformAction(params.idPlatform))
      .subscribe(store);  
    this.surveySubscription = route.params
      .map(params => new PlatformAction.SelectSurveyAction(params.idSurvey))
      .subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.let(getSelectedPlatform);
    this.survey$ = this.store.let(getSelectedSurvey);
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.surveySubscription.unsubscribe();
  }

  onSubmit(survey: Survey) { 
    this.store.dispatch(new PlatformAction.AddSurveyAction(survey));
  }
}
