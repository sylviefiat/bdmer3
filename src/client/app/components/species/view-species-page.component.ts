import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAppState, getSelectedSpecies, getisAdmin, getCountriesInApp } from '../../modules/ngrx/index';
import { Species } from '../../modules/datas/models/species';
import { Country } from '../../modules/countries/models/country';
import { SpeciesAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

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
  selector: 'bc-view-species-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-view-species 
      [species]="species$ | async"
      [isAdmin]="isAdmin$ | async"
      [countries]="countries$ | async"
      (action)="actionSpecies($event)"
      (remove)="removeSpecies($event)">
    </bc-view-species>
  `,
})
export class ViewSpeciesPageComponent implements OnInit, OnDestroy {
  actionsSubscription: Subscription;
  species$: Observable<Species | null>;
  isAdmin$: Observable<boolean>;
  countries$: Observable<Country[]>;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    this.actionsSubscription = route.params.pipe(
      map(params => new SpeciesAction.SelectAction(params.id)))
      .subscribe(store);
  }

  ngOnInit() {
    this.species$ = this.store.select(getSelectedSpecies);
    this.isAdmin$ = this.store.select(getisAdmin);
    this.countries$ = this.store.select(getCountriesInApp);
    this.store.dispatch(new CountriesAction.LoadAction());
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

  viewSpecies(species: Species) {
    this.routerext.navigate(['/species/' + species._id], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }

  actionSpecies(redirect: String) {
    this.routerext.navigate([redirect]);
  }
  removeSpecies(species: Species) {
    this.store.dispatch(new SpeciesAction.RemoveSpeciesAction(species));
  }
}
