import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../../modules/core/index';
import { Species } from '../../../modules/datas/models/species';
import { IAppState, getSpeciesPageError, getSelectedSpecies } from '../../../modules/ngrx/index';
import { SpeciesAction } from '../../../modules/datas/actions/index';
import { CountriesAction } from '../../../modules/countries/actions/index';

@Component({
    selector: 'bc-species-page',
    template: `
    <bc-species-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [species]="species$ | async">
    </bc-species-form>
  `,
})
export class SpeciesFormPageComponent implements OnInit, OnDestroy {
    error$: Observable<string | null>;
    species$: Observable<Species | null>;
    actionsSubscription: Subscription;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.actionsSubscription = route.params
            .map(params => new SpeciesAction.SelectAction(params.id))
            .subscribe(store);
    }

    ngOnInit() {
        this.error$ = this.store.let(getSpeciesPageError);
        this.species$ = this.store.let(getSelectedSpecies);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    onSubmit(species: Species) {
        this.store.dispatch(new SpeciesAction.AddSpeciesAction(species));
    }
}