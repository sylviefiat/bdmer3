// libs
import { Component, ElementRef, ViewChild, OnInit, Input, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// app
import { RouterExtensions, Config } from '../../modules/core/index';
import { IAppState, getisLoggedIn, getPlatformListCurrentCountry, getAuthCountry, getAllCountriesInApp, getisAdmin } from '../../modules/ngrx/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country'
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { CountryListService} from '../../modules/countries/services/country-list.service';


@Component({
  moduleId: module.id,
  selector: 'sd-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {

  loggedIn$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  platforms$: Observable<Platform[]>;
  userCountry$: Observable<Country>
  countries$: Observable<Country[]>;


  public isOnline: boolean = navigator.onLine;

  constructor(private store: Store<IAppState>) {}

  ngOnInit() {   
    this.loggedIn$ = this.store.select(getisLoggedIn);
    this.loggedIn$.subscribe(loggedIn => {
      console.log(loggedIn);
      if(loggedIn){
        this.store.dispatch(new PlatformAction.LoadAction());
        this.store.dispatch(new CountriesAction.LoadAction());
        this.store.dispatch(new CountriesAction.InitAction());
        this.isAdmin$ = this.store.select(getisAdmin);

        this.platforms$ = this.store.select(getPlatformListCurrentCountry);

        this.userCountry$ = this.store.select(getAuthCountry);

        this.countries$ = this.store.select(getAllCountriesInApp);
      }
    });
    
  }
}
