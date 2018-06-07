import { NgModule, ModuleWithProviders, Optional, SkipSelf, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/index';
import { MultilingualModule } from '../i18n/multilingual.module';

import { CountriesEffects, CountryEffects } from './effects/index';
import { CountryExistsGuard } from './guards/country-exists';
import { CountryListService } from './services/country-list.service';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    EffectsModule.forFeature([CountriesEffects,CountryEffects])
  ],
  declarations: [],
  providers:[CountryExistsGuard, CountryListService],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    SharedModule
  ]
})
export class CountriesModule {
  constructor(@Optional() @SkipSelf() parentModule: CountriesModule) {
    if (parentModule) {
      throw new Error('CountriesModule already loaded; Import in root module only.');
    }
  }
}