import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

import { IAppState, getPlatformPageError, getSelectedPlatform, getAuthCountry, getCountriesInApp, getisAdmin } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    selector: 'bc-platform-page',
    template: `    
    <bc-platform-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [platform]="platform$ | async"
      [country]="country$ | async"
      [countries]="countries$ | async"
      [isAdmin]="isAdmin$ | async">
    </bc-platform-form>
  `,
  styles: [
    `
    mat-card {
      text-align: center;
    }
    mat-card-title {
      display: flex;
      justify-content: center;
    }
  `
  ]
})
export class PlatformFormPageComponent implements OnInit, OnDestroy {
    error$: Observable<string | null>;
    platform$: Observable<Platform | null>;
    country$: Observable<Country | null>;
    countries$: Observable<Country[]>;
    isAdmin$: Observable<boolean>;
    actionsSubscription: Subscription;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.actionsSubscription = route.params
            .map(params => new PlatformAction.SelectPlatformAction(params.id))
            .subscribe(store);
    }

    ngOnInit() {
        this.error$ = this.store.let(getPlatformPageError);
        this.platform$ = this.store.let(getSelectedPlatform);
        this.country$ = this.store.let(getAuthCountry);
        this.countries$ = this.store.let(getCountriesInApp);
        this.isAdmin$ = this.store.let(getisAdmin);
        this.store.dispatch(new CountriesAction.LoadAction());
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    onSubmit(platform: Platform) {
        console.log(platform);
        this.store.dispatch(new PlatformAction.AddPlatformAction(platform));
    }
}