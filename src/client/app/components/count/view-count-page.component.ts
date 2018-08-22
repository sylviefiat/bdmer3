import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { RouterExtensions, Config } from "../../modules/core/index";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of, Subscription } from "rxjs";
import { map } from "rxjs/operators";

import {
  IAppState,
  getSelectedPlatform,
  getAllCountriesInApp,
  getAuthUser,
  getSelectedZone,
  getSelectedStation,
  getSelectedSurvey,
  getSelectedCount,
  getLangues,
  getSpeciesInApp
} from "../../modules/ngrx/index";
import { Platform, Zone, Survey, Station, Count, Species } from "../../modules/datas/models/index";
import { Country } from "../../modules/countries/models/country";
import { User } from "../../modules/countries/models/country";
import { PlatformAction } from "../../modules/datas/actions/index";
import { SpeciesAction } from "../../modules/datas/actions/index";

/**
 * Note: Container components are also reusable. Whether or not
 * a component is a presentation component or a container
 * component is an implementation detail.
 *
 * The View Book Page's responsibility is to map router params
 * to a 'Select' book action. Actually showing the selected
 * book remains a responsibility of the
 * SelectedBookPageComponent
 */
@Component({
  selector: "bc-view-count-page",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-count
      [platform]="platform$ | async"
      [survey]="survey$ | async"
      [count]="count$ | async"
      [locale]="locale$ | async"
      [species]="speciesList$ | async"
      [countries]="countries$ | async"
      (remove)="removeCount($event)"
      (action)="actionCount($event)">
    </bc-count>
  `
})
export class ViewCountPageComponent implements OnInit, OnDestroy {
  platformSubscription: Subscription;
  surveySubscription: Subscription;
  countSubscription: Subscription;
  platform$: Observable<Platform | null>;
  survey$: Observable<Survey | null>;
  count$: Observable<Count | null>;
  locale$: Observable<string>;
  speciesList$: Observable<Species[]>;
  countries$: Observable<Country[]>;

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.platformSubscription = route.params.pipe(map(params => new PlatformAction.SelectPlatformAction(params.idPlatform))).subscribe(store);
    this.surveySubscription = route.params.pipe(map(params => new PlatformAction.SelectSurveyAction(params.idSurvey))).subscribe(store);
    this.countSubscription = route.params.pipe(map(params => new PlatformAction.SelectCountAction(params.idCount))).subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.select(getSelectedPlatform);
    this.survey$ = this.store.select(getSelectedSurvey);
    this.count$ = this.store.select(getSelectedCount);
    this.locale$ = this.store.select(getLangues);
    this.speciesList$ = this.store.select(getSpeciesInApp);
    this.countries$ = this.store.select(getAllCountriesInApp);
    this.store.dispatch(new SpeciesAction.LoadAction());
  }

  ngOnDestroy() {
    this.platformSubscription.unsubscribe();
    this.surveySubscription.unsubscribe();
    this.countSubscription.unsubscribe();
  }

  actionCount(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeCount(count: Count) {
    this.store.dispatch(new PlatformAction.RemoveCountAction(count));
  }
}
