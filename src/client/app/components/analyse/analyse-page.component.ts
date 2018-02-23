import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState, getCountriesInApp, getisAdmin, getAnalyseMsg } from '../../modules/ngrx/index';
import { Site, Zone, Campaign } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';
import { CountriesAction } from '../../modules/countries/actions/index';


@Component({
  selector: 'bc-analyse-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-analyse 
      [countries]="countries$ | async"
      [isAdmin]="isAdmin | async"
      [msg]="msg$ | async"
      (analyse)="startAnalyse($event)">
    </bc-analyse>
  `,
})
export class AnalysePageComponent implements OnInit {
  countries$: Observable<Country[]>;
  isAdmin$: Observable<boolean>;
  msg$: Observable<string>;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    
  }

  ngOnInit() {
    this.countries$ = this.store.let(getCountriesInApp);
    this.store.dispatch(new CountriesAction.LoadAction());
    this.isAdmin$ = this.store.let(getisAdmin);
    this.msg$ = this.store.let(getAnalyseMsg);
  }

  startAnalyse(status: string){

  }

}
