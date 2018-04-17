import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedPlatform, getAuthUser, getSelectedZone, getSelectedSurvey, getSelectedSurveyCounts, getLangues, getSpeciesInApp } from '../../modules/ngrx/index';
import { Platform, Zone, Survey, Count, Species } from '../../modules/datas/models/index';
import { User } from '../../modules/countries/models/country';
import { PlatformAction, SpeciesAction } from '../../modules/datas/actions/index';


@Component({
  selector: 'bc-view-survey-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-view-survey 
      [platform]="platform$ | async"
      [survey]="survey$ | async"
      [counts$]="counts$"
      [locale]="locale$ | async"
      [species]="species$ | async"
      (action)="actionSurvey($event)"
      (remove)="removeSurvey($event)">
    </bc-view-survey>
  `,
})
export class ViewSurveyPageComponent implements OnInit, OnDestroy {
  platformSubscription: Subscription;
  surveySubscription: Subscription;
  platform$: Observable<Platform | null>;
  survey$: Observable<Survey | null>;
  counts$: Observable<Count[]>
  locale$: Observable<string>;
  species$: Observable<Species[]>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
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
    this.counts$ = this.store.let(getSelectedSurveyCounts);
    this.locale$ = this.store.let(getLangues);
    this.species$ = this.store.let(getSpeciesInApp);
    this.store.dispatch(new SpeciesAction.LoadAction());
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.surveySubscription.unsubscribe();
  }

  actionSurvey(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeSurvey(survey: Survey){
    this.store.dispatch(new PlatformAction.RemoveSurveyAction(survey));
  }
}
