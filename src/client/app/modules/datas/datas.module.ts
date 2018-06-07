import { NgModule, ModuleWithProviders, Optional, SkipSelf, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/index';
import { MultilingualModule } from '../i18n/multilingual.module';

import { SpeciesEffects, PlatformEffects } from './effects/index';
import { SpeciesService, PlatformService } from './services/index';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    EffectsModule.forFeature([SpeciesEffects,PlatformEffects])
  ],
  declarations: [],
  providers:[SpeciesService, PlatformService],
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