import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedPlatform, getAuthUser, getSelectedZone, getSelectedTransect, getSelectedSurvey,getSelectedCount, getLangues, getSpeciesInApp } from '../../modules/ngrx/index';
import { Platform, Zone, Survey, Transect, Count, Species } from '../../modules/datas/models/index';
import { User } from '../../modules/countries/models/country';
import { PlatformAction } from '../../modules/datas/actions/index';
import { SpeciesAction } from '../../modules/datas/actions/index';

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
  selector: 'bc-view-count-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-count 
      [platform]="platform$ | async"
      [survey]="survey$ | async"
      [count]="count$ | async"
      [locale]="locale$ | async" 
      [species]="speciesList$ | async"
      (remove)="removeCount($event)"
      (action)="actionCount($event)">
    </bc-count>
  `,
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

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.platformSubscription = route.params
      .map(params => new PlatformAction.SelectPlatformAction(params.idPlatform))
      .subscribe(store);
    this.surveySubscription = route.params
      .map(params => new PlatformAction.SelectSurveyAction(params.idSurvey))
      .subscribe(store);
    this.countSubscription = route.params
      .map(params => new PlatformAction.SelectCountAction(params.idCount))
      .subscribe(store);
  }

  ngOnInit() {
    this.platform$ = this.store.let(getSelectedPlatform);
    this.survey$ = this.store.let(getSelectedSurvey);
    this.count$ = this.store.let(getSelectedCount);
    this.locale$ = this.store.let(getLangues);
    this.speciesList$ = this.store.let(getSpeciesInApp);
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

  removeCount(count: Count){
    this.store.dispatch(new PlatformAction.RemoveCountAction(count));
  }
}
