import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { RouterExtensions, Config } from '../../../modules/core/index';
import { Species } from '../../../modules/datas/models/species';
import { IAppState, getSpeciesPageError } from '../../../modules/ngrx/index';
import { SpeciesAction } from '../../../modules/datas/actions/index';

@Component({
  selector: 'bc-new-species-page',
  template: `
    <bc-new-species-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async">
    </bc-new-species-form>
  `,
})
export class NewSpeciesPageComponent implements OnInit {
  error$: Observable<string | null>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
    this.error$ = this.store.let(getSpeciesPageError);    
  }

  onSubmit(species: Species) {
    this.store.dispatch(new SpeciesAction.AddSpeciesAction(species));
  }
}