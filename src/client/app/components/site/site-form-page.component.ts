import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Site } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

import { IAppState, getSitePageError, getSelectedSite, getSelectedCountry, getAllCountriesInApp } from '../../modules/ngrx/index';
import { SiteAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    selector: 'bc-site-page',
    template: `    
    <bc-site-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [site]="site$ | async"
      [country]="country$ | async"
      [countries]="countries$ | async">
    </bc-site-form>
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
export class SiteFormPageComponent implements OnInit, OnDestroy {
    error$: Observable<string | null>;
    site$: Observable<Site | null>;
    country$: Observable<Country | null>;
    countries$: Observable<Country[]>;
    actionsSubscription: Subscription;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.actionsSubscription = route.params
            .map(params => new SiteAction.SelectSiteAction(params.id))
            .subscribe(store);
    }

    ngOnInit() {
        this.error$ = this.store.let(getSitePageError);
        this.site$ = this.store.let(getSelectedSite);
        this.country$ = this.store.let(getSelectedCountry);
        this.countries$ = this.store.let(getAllCountriesInApp);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    onSubmit(site: Site) {
        console.log(site);
        this.store.dispatch(new SiteAction.AddSiteAction(site));
    }
}