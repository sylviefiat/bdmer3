import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState, getLangues, getCountriesInApp, getisAdmin, getAnalyseMsg, getSelectedCountryPlatforms,
  getSelectedAnalyseYears, getSelectedAnalyseSurveys, getSelectedAnalyseZones,getSelectedAnalyseStations, 
  getSelectedAnalyseSpecies,getAnalyseCountry } from '../../modules/ngrx/index';
import { Platform, Zone, Survey, Station, Species } from '../../modules/datas/models/index';
import { Method, DimensionsAnalyse } from '../../modules/analyse/models/index';
import { Country } from '../../modules/countries/models/country';
import { CountriesAction, CountryAction } from '../../modules/countries/actions/index';
import { PlatformAction, SpeciesAction } from '../../modules/datas/actions/index';
import { AnalyseAction } from '../../modules/analyse/actions/index';


@Component({
  selector: 'bc-analyse-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-analyse 
      [countries]="countries$ | async"
      [currentCountry$]="currentCountry$"
      [platforms$]="platforms$"
      [years$]="years$"
      [surveys$]="surveys$"
      [zones$]="zones$"
      [stations$]="stations$"
      [species$]="species$"
      [species$]="species$"
      [isAdmin]="isAdmin$ | async"
      [locale]="locale$ | async"
      [msg]="msg$ | async"
      (countryEmitter)="selectCountry($event)"
      (platformEmitter)="selectPlatform($event)"
      (yearEmitter)="selectYear($event)"
      (surveyEmitter)="selectSurvey($event)"
      (zoneEmitter)="selectZone($event)"
      (stationEmitter)="selectStation($event)"
      (speciesEmitter)="selectSpecies($event)"
      (dimensionsEmitter)="setDimensions($event)"
      (methodEmitter)="selectMethod($event)"
      (analyse)="startAnalyse($event)">
    </bc-analyse>
  `,
})
export class AnalysePageComponent implements OnInit {
  countries$: Observable<Country[]>;
  currentCountry$: Observable<Country>;
  platforms$: Observable<Platform[]>;
  years$: Observable<string[]>;
  surveys$: Observable<Survey[]>;
  zones$: Observable<Zone[]>;
  stations$: Observable<Station[]>;
  species$: Observable<Species[]>;
  dimensions$: Observable<DimensionsAnalyse[]>;
  isAdmin$: Observable<boolean>;
  locale$: Observable<string>;
  msg$: Observable<string>;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    
  }

  ngOnInit() {
    this.isAdmin$ = this.store.let(getisAdmin);
    this.locale$ = this.store.let(getLangues);
    this.countries$ = this.store.let(getCountriesInApp);
    this.currentCountry$ = this.store.let(getAnalyseCountry);
    this.platforms$ = this.store.let(getSelectedCountryPlatforms);
    this.years$ = this.store.let(getSelectedAnalyseYears);
    this.surveys$ = this.store.let(getSelectedAnalyseSurveys);
    this.zones$ = this.store.let(getSelectedAnalyseZones);
    this.stations$ = this.store.let(getSelectedAnalyseStations);
    this.species$ = this.store.let(getSelectedAnalyseSpecies);
    this.msg$ = this.store.let(getAnalyseMsg);
    this.store.dispatch(new CountriesAction.LoadAction());
    this.store.dispatch(new SpeciesAction.LoadAction());
  }

  selectCountry(country: Country) {
    this.store.dispatch(new CountryAction.SelectAction(country.code));
    this.store.dispatch(new PlatformAction.LoadAction());
    this.store.dispatch(new AnalyseAction.SelectCountry(country));
  }

  selectPlatform(platforms: Platform[]) {
    this.store.dispatch(new AnalyseAction.SelectPlatforms(platforms));
  }

  selectYear(years: string[]) {
    this.store.dispatch(new AnalyseAction.SelectYears(years));
  }

  selectSurvey(surveys: Survey[]) {
    this.store.dispatch(new AnalyseAction.SelectSurveys(surveys));
  }

  selectZone(zones: Zone[]) {
    this.store.dispatch(new AnalyseAction.SelectZones(zones));    
  }

  selectStation(stations: Station[]) {
    this.store.dispatch(new AnalyseAction.SelectStations(stations));    
  }

  selectSpecies(species: Species[]) {
    this.store.dispatch(new AnalyseAction.SelectSpecies(species));    
  }

  setDimensions(dims: DimensionsAnalyse[]) {
    this.store.dispatch(new AnalyseAction.SelectDims(dims));    
  }

  selectMethod(method: Method) {
    this.store.dispatch(new AnalyseAction.SelectMethod(method));    
  }

  startAnalyse(status: string) {
    this.store.dispatch(new AnalyseAction.Analyse(status)); 
  }


}
