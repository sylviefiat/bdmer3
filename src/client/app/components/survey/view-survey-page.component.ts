import "rxjs/add/operator/map";
import "rxjs/add/operator/pluck";
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { RouterExtensions, Config } from "../../modules/core/index";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of, Subscription } from "rxjs";
import { map } from "rxjs/operators";

import {
  IAppState,
  getSelectedPlatform,
  getAuthUser,
  getSelectedZone,
  getAllCountriesInApp,
  getSelectedSurvey,
  getSelectedSurveyCounts,
  getLangues,
  getSpeciesInApp
} from "../../modules/ngrx/index";
import { Platform, Zone, Survey, Count, Species } from "../../modules/datas/models/index";
import { User } from "../../modules/countries/models/country";
import { PlatformAction, SpeciesAction } from "../../modules/datas/actions/index";
import { Country } from "../../modules/countries/models/country";

@Component({
  selector: "bc-view-survey-page",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-view-survey
      [platform]="platform$ | async"
      [survey]="survey$ | async"
      [counts$]="counts$"
      [locale]="locale$ | async"
      [species]="species$ | async"
      [countries]="countries$ | async"
      (action)="actionSurvey($event)"
      (remove)="removeSurvey($event)">
    </bc-view-survey>
  `
})
export class ViewSurveyPageComponent implements OnInit, OnDestroy {
  platformSubscription: Subscription;
  surveySubscription: Subscription;
  platform$: Observable<Platform | null>;
  survey$: Observable<Survey | null>;
  counts$: Observable<Count[]>;
  locale$: Observable<string>;
  species$: Observable<Species[]>;
  countries$: Observable<Country[]>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.platformSubscription = route.params.pipe(map(params => new PlatformAction.SelectPlatformAction(params.idPlatform))).subscribe(store);
    this.surveySubscription = route.params.pipe(map(params => new PlatformAction.SelectSurveyAction(params.idSurvey))).subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.select(getSelectedPlatform);
    this.survey$ = this.store.select(getSelectedSurvey);
    this.counts$ = this.store.select(getSelectedSurveyCounts);
    this.locale$ = this.store.select(getLangues);
    this.species$ = this.store.select(getSpeciesInApp);
    this.countries$ = this.store.select(getAllCountriesInApp);
    this.store.dispatch(new SpeciesAction.LoadAction());
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.surveySubscription.unsubscribe();
  }

  actionSurvey(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeSurvey(survey: Survey) {
    this.store.dispatch(new PlatformAction.RemoveSurveyAction(survey));
  }
}
