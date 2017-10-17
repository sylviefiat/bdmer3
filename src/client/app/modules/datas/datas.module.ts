import { NgModule, ModuleWithProviders, Optional, SkipSelf, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/index';
import { MultilingualModule } from '../i18n/multilingual.module';

import { SpeciesEffects } from './effects/index';
//import { CountryExistsGuard } from './guards/country-exists';
import { SpeciesService } from './services/species.service';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    MultilingualModule,
    EffectsModule.run(SpeciesEffects),
  ],
  declarations: [],
  providers:[/*CountryExistsGuard, */SpeciesService],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    SharedModule
  ]
})
export class SpeciesModule {
  constructor(@Optional() @SkipSelf() parentModule: SpeciesModule) {
    if (parentModule) {
      throw new Error('CountriesModule already loaded; Import in root module only.');
    }
  }
}