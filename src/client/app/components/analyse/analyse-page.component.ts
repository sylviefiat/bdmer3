import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState, getLangues, getCountriesInApp, getisAdmin, getAnalyseMsg, getSelectedCountryCampaigns, 
  getSelectedCampaignsZones, getSelectedCampaignsTransects } from '../../modules/ngrx/index';
import { Site, Zone, Campaign, Transect } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';
import { CountriesAction, CountryAction } from '../../modules/countries/actions/index';
import { SiteAction } from '../../modules/datas/actions/index';
import { AnalyseAction } from '../../modules/analyse/actions/index';


@Component({
  selector: 'bc-analyse-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-analyse 
      [countries]="countries$ | async"
      [campaigns]="campaigns$ | async"
      [zonesList]="zones$ | async"
      [transectsList]="transects$ | async"
      [isAdmin]="isAdmin$ | async"
      [locale]="locale$ | async"
      [msg]="msg$ | async"
      (countryEmitter)="selectCountry($event)"
      (campaignEmitter)="selectCampaign($event)"
      (zoneEmitter)="selectZone($event)"
      (analyse)="startAnalyse($event)">
    </bc-analyse>
  `,
})
export class AnalysePageComponent implements OnInit {
  countries$: Observable<Country[]>;
  campaigns$: Observable<Campaign[]>;
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
    this.campaigns$ = this.store.let(getSelectedCountryCampaigns);
    this.msg$ = this.store.let(getAnalyseMsg);
    this.store.dispatch(new CountriesAction.LoadAction());
    this.store.dispatch(new SiteAction.LoadAction());
  }

  selectCountry(country: Country){
    this.store.dispatch(new CountryAction.SelectAction(country.code));
    this.store.dispatch(new AnalyseAction.SelectCountry(country));
    this.campaigns$ = this.store.let(getSelectedCountryCampaigns);
  }

  selectCampaign(campaigns: Campaign[]){
    this.store.dispatch(new AnalyseAction.SelectCampaigns(campaigns));
    this.zones$ = this.store.let(getSelectedCampaignsZones);
    this.transects$ = this.store.let(getSelectedCampaignsTransects);
  }

  selectZone(zones: Zone[][]){
    this.store.dispatch(new AnalyseAction.SelectZones(zones));    
  }

  startAnalyse(status: string){

  }


}
