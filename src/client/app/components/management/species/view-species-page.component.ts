import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedSpecies, getAuthUser } from '../../../modules/ngrx/index';
import { Species } from '../../../modules/datas/models/species';
import { User } from '../../../modules/countries/models/country';
import { SpeciesAction } from '../../../modules/datas/actions/index';

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
      [currentUser]="currentUser$ | async"
      (edit)="editSpecies($event)"
      (remove)="removeSpecies($event)">
    </bc-view-species>
  `,
})
export class ViewSpeciesPageComponent implements OnInit, OnDestroy {
  actionsSubscription: Subscription;
  species$: Observable<Species | null>;
  currentUser$: Observable<User>;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    this.actionsSubscription = route.params
      .map(params => new SpeciesAction.SelectAction(params.id))
      .subscribe(store);
  }

  ngOnInit() {
    this.species$ = this.store.let(getSelectedSpecies);
    this.currentUser$ = this.store.let(getAuthUser);
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

  editSpecies(species: Species) {
    this.routerext.navigate(['/speciesForm/' + species._id], {
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }
  removeSpecies(species: Species) {
    this.store.dispatch(new SpeciesAction.RemoveSpeciesAction(species));
  }
}
