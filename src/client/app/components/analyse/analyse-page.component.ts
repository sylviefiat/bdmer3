import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState, getLangues, getCountriesInApp, getisAdmin, getAnalyseMsg, getSelectedCountrySurveys, getSelectedCountryPlatforms,
  getSelectedSurveysZones, getSelectedSurveysTransects } from '../../modules/ngrx/index';
import { Platform, Zone, Survey, Transect } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';
import { CountriesAction, CountryAction } from '../../modules/countries/actions/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { AnalyseAction } from '../../modules/analyse/actions/index';


@Component({
  selector: 'bc-analyse-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-analyse 
      [countries]="countries$ | async"
      [platforms]="platforms$ | async"
      [surveys]="surveys$ | async"
      [zonesList]="zones$ | async"
      [transectsList]="transects$ | async"
      [isAdmin]="isAdmin$ | async"
      [locale]="locale$ | async"
      [msg]="msg$ | async"
      (countryEmitter)="selectCountry($event)"
      (surveyEmitter)="selectSurvey($event)"
      (zoneEmitter)="selectZone($event)"
      (analyse)="startAnalyse($event)">
    </bc-analyse>
  `,
})
export class AnalysePageComponent implements OnInit {
  countries$: Observable<Country[]>;
  platforms$: Observable<Platform[]>;
  surveys$: Observable<Survey[]>;
  transects$: Observable<Transect[]>;
  zones$: Observable<any>;
  isAdmin$: Observable<boolean>;
  locale$: Observable<string>;
  msg$: Observable<string>;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    
  }

  ngOnInit() {
    this.isAdmin$ = this.store.let(getisAdmin);
    this.locale$ = this.store.let(getLangues);
    this.countries$ = this.store.let(getCountriesInApp);
    this.platforms$ = this.store.let(getSelectedCountryPlatforms);
    this.surveys$ = this.store.let(getSelectedCountrySurveys);
    this.msg$ = this.store.let(getAnalyseMsg);
    this.store.dispatch(new CountriesAction.LoadAction());
    this.store.dispatch(new PlatformAction.LoadAction());
  }

  selectCountry(country: Country) {
    this.store.dispatch(new CountryAction.SelectAction(country.code));
    this.store.dispatch(new AnalyseAction.SelectCountry(country));
    this.platforms$ = this.store.let(getSelectedCountryPlatforms);
  }

  selectSurvey(surveys: Survey[]) {
    this.store.dispatch(new AnalyseAction.SelectSurveys(surveys));
    this.zones$ = this.store.let(getSelectedSurveysZones);
    this.transects$ = this.store.let(getSelectedSurveysTransects);
  }

  selectZone(zones: Zone[][]) {
    this.store.dispatch(new AnalyseAction.SelectZones(zones));    
  }

  startAnalyse(status: string) {
    //TODO
  }


}
