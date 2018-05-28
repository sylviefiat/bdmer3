import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import * as togeojson from '@mapbox/togeojson';
import * as area from '@mapbox/geojson-area';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform } from '../../modules/datas/models/index';
import { Country } from '../../modules/countries/models/country';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getisAdmin, getLangues, getPlatformImpErrors } from '../../modules/ngrx/index';
import { PlatformAction, SpeciesAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';
import { NameRefactorService } from '../../modules/core/services/nameRefactor.service';
import { MapStaticService } from '../../modules/core/services/map-static.service';
import { GeojsonService } from '../../modules/core/services/geojson.service';

@Component({
  selector: 'bc-global-import-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-global-import 
      [platform]="platform$ | async"
      [error]="error$ | async"
      [importError]="importError$ | async"
      [isAdmin]="isAdmin$ | async"
      [locale]="locale$ | async"
      [docs_repo]="docs_repo">
    </bc-global-import>
  `,
})
export class GlobalImportPageComponent implements OnInit, OnDestroy {
    platform$: Observable<Platform>;
    error$: Observable<string | null>;
    importError$: Observable<string[]>;
    isAdmin$: Observable<Country>;
    locale$: Observable<boolean>;
    docs_repo: string;

    constructor(private geojsonService: GeojsonService, private mapStaticService: MapStaticService, private nameRefactorService: NameRefactorService, private store: Store<IAppState>, public routerext: RouterExtensions, private router: Router) {
    }

    ngOnInit() {
        this.platform$ = this.store.let(getSelectedPlatform);
        this.importError$ = this.store.let(getPlatformImpErrors);
        this.error$ = this.store.let(getPlatformPageError);
        this.isAdmin$ = this.store.let(getisAdmin);
        this.store.dispatch(new SpeciesAction.LoadAction());
        this.locale$ = this.store.let(getLangues);
        this.docs_repo="../../../assets/files/";
    }

    send() {
        
    }    

    return() {
        this.routerext.navigate(['/platform/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }

    ngOnDestroy() {
        this.store.dispatch(new PlatformAction.ResetAllPendingAction());
    }
}