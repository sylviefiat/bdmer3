import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, of, pipe, Subscription } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { map, catchError, first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform, Zone, Survey, Count, Species, Station } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getSelectedZone, getCountryCountList, getSelectedSurvey, getSelectedCount, getSpeciesInApp } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { SpeciesAction } from '../../modules/datas/actions/index';

@Component({
  selector: 'bc-count-page',
  template: `
    <bc-count-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [platform]="platform$ | async"
      [survey]="survey$ | async"
      [count]="count$ | async"
      [species]="species$ | async">
    </bc-count-form>
  `,
  styles: [
    `
    #count-page {
      display: flex;
      flex-direction:row;
      justify-content: center;
      margin: 72px 0;
    }
    mat-card {
      min-width: 500px;
    }
    `]
})
export class CountFormPageComponent implements OnInit, OnDestroy {
  error$: Observable<string | null>;
  platform$: Observable<Platform>;
  survey$: Observable<Survey>;
  count$: Observable<Count>;
  species$: Observable<Species[]>;
  platformSubscription: Subscription;
  surveySubscription: Subscription;
  countSubscription: Subscription;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private route: ActivatedRoute, private _fb: FormBuilder) {
    this.platformSubscription = route.params.pipe(
      map(params => new PlatformAction.SelectPlatformAction(params.idPlatform)))
      .subscribe(store);
    this.surveySubscription = route.params.pipe(
      map(params => new PlatformAction.SelectSurveyAction(params.idSurvey)))
      .subscribe(store);
    this.countSubscription = route.params.pipe(
      map(params => new PlatformAction.SelectCountAction(params.idCount)))
      .subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.select(getSelectedPlatform);
    this.survey$ = this.store.select(getSelectedSurvey);
    this.count$ = this.store.select(getSelectedCount);
    this.species$ = this.store.select(getSpeciesInApp);
    this.store.dispatch(new SpeciesAction.LoadAction());
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.surveySubscription.unsubscribe();
    this.countSubscription.unsubscribe();
  }

  onSubmit(count: Count) {
    this.store.dispatch(new PlatformAction.AddCountAction(count))
  }
}
