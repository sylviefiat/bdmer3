import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getSelectedCountry, getisAdmin,getUserMessage,getUserErr } from '../../modules/ngrx/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { Country } from '../../modules/countries/models/country';
import { Platform } from '../../modules/datas/models/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { PlatformService } from '../../modules/datas/services/platform.service';

@Component({
  selector: 'bc-selected-country-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-country-detail
      [country]="country$ | async"
      [isAdmin]="isAdmin$ | async"
      [msg]="msg$ | async"
      (removecountry)="removeFromCountries($event)">
    </bc-country-detail>
  `,
})
export class SelectedCountryPageComponent implements OnInit {
  country$: Observable<Country>;
  isAdmin$: Observable<boolean>;
  msg$: Observable<string>;

  constructor(private platformService: PlatformService, private store: Store<IAppState>, public routerext: RouterExtensions) {            
  }

  ngOnInit() {
    this.store.dispatch(new CountriesAction.LoadAction()); 
    this.country$ = this.store.select(getSelectedCountry);
    this.isAdmin$ = this.store.select(getisAdmin);
    this.msg$ = this.store.select(getUserMessage);
  }

  removeFromCountries(data) {
    for(let i = 0; i < data.platforms.length; i++){
      let platforms$ = this.platformService.getPlatform(data.platforms[i].code);
      platforms$.subscribe(
          (res) => {
           this.store.dispatch(new PlatformAction.RemovePlatformCountryAction(res));
          }
      );
    }
    this.store.dispatch(new CountriesAction.RemoveCountryAction(data.country));  
  }
}
