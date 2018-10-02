
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { IAppState, getLangues, getCountriesInApp, getisAdmin, getAnalyseMsg, getSelectedCountryPlatforms,
  getSelectedAnalyseYears, getSelectedAnalyseSurveys, getSelectedAnalyseZones,getSelectedAnalyseStations, 
  getSelectedAnalyseSpecies,getAnalyseCountry, getAnalyseData, getSelectedCountry } from '../../modules/ngrx/index';
import { Platform, Zone, Survey, Station, Species } from '../../modules/datas/models/index';
import { Data, Method, DimensionsAnalyse } from '../../modules/analyse/models/index';
import { initMethods } from '../../modules/analyse/states/index';
import { Country } from '../../modules/countries/models/country';
import { CountriesAction, CountryAction } from '../../modules/countries/actions/index';
import { PlatformAction, SpeciesAction } from '../../modules/datas/actions/index';
import { AnalyseAction } from '../../modules/analyse/actions/index';
import { LoaderAction } from "../../modules/core/actions/index";


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
      [usedZones$]="usedZones$"
      [stations$]="stations$"
      [species$]="species$"
      [methodsAvailables$]="methodsAvailables$"
      [isAdmin$]="isAdmin$"
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
  usedZones$: Observable<Zone[]>;
  stations$: Observable<Station[]>;
  species$: Observable<Species[]>;
  dimensions$: Observable<DimensionsAnalyse[]>;
  methodsAvailables$: Observable<Method[]>;
  isAdmin$: Observable<boolean>;
  locale$: Observable<string>;
  msg$: Observable<string>;
  data$: Observable<Data>;

  constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions) {
    
  }

  ngOnInit() {
    this.isAdmin$ = this.store.select(getisAdmin);
    this.locale$ = this.store.select(getLangues);
    this.countries$ = this.store.select(getCountriesInApp);
    this.currentCountry$ = this.store.select(getSelectedCountry);
    this.platforms$ = this.store.select(getSelectedCountryPlatforms);
    this.years$ = this.store.select(getSelectedAnalyseYears);
    this.surveys$ = this.store.select(getSelectedAnalyseSurveys);
    this.zones$ = this.store.select(getSelectedAnalyseZones);
    this.stations$ = this.store.select(getSelectedAnalyseStations);
    this.species$ = this.store.select(getSelectedAnalyseSpecies);
    this.msg$ = this.store.select(getAnalyseMsg);
    this.data$ = this.store.select(getAnalyseData);
    this.usedZones$ = this.data$.map(data => data.usedZones); 
    this.methodsAvailables$ = this.data$.map(data => {
      let methods = initMethods;
      if(!data.usedSurveys || !data.usedSpecies || (data.usedSurveys && data.usedSurveys.filter(s => s.counts && s.counts.filter(c => c.quantities && c.quantities.length>0).length>0).length>0)){
        methods = methods.filter((method:Method)=> method.method==="NONE");
        return methods;
      } else {
        if(data.usedSpecies && data.usedSpecies.filter(sp => !sp.LW || sp.LW.coefA===0 || sp.LW.coefB===0).length>0){
          methods=methods.filter((method:Method)=> method.method!=="LONGUEUR");
        }
        if(data.usedSpecies && data.usedSpecies.filter(sp => !sp.LLW || sp.LLW.coefA===0 || sp.LLW.coefB===0).length>0){
          methods=methods.filter((method:Method)=> method.method!=="LONGLARG");
        }
        return methods;
      }
    });
    this.store.dispatch(new CountriesAction.LoadAction());
    this.store.dispatch(new SpeciesAction.LoadAction());
    this.store.dispatch(new PlatformAction.LoadAction());
    this.store.dispatch(new AnalyseAction.SetDefaultCountry());
  }

  selectCountry(country: Country) {
    this.store.dispatch(new CountryAction.SelectAction(country.code));
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
    this.store.dispatch(new AnalyseAction.Redirect(status)); 
  }


}
