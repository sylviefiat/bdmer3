import { NgModule, ModuleWithProviders, Optional, SkipSelf, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/index';
import { MultilingualModule } from '../i18n/multilingual.module';

import { SpeciesEffects, SiteEffects } from './effects/index';
//import { CountryExistsGuard } from './guards/country-exists';
import { SpeciesService, SiteService } from './services/index';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    MultilingualModule,
    EffectsModule.run(SpeciesEffects),
    EffectsModule.run(SiteEffects),
  ],
  declarations: [],
  providers:[SpeciesService, SiteService],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    SharedModule
  ]
})
export class DatasModule {
  constructor(@Optional() @SkipSelf() parentModule: DatasModule) {
    if (parentModule) {
      throw new Error('DatasModule already loaded; Import in root module only.');
    }
  }
}