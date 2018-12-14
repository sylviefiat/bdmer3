import { NgModule, ModuleWithProviders, Optional, SkipSelf,NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/index';
import { MultilingualModule } from '../i18n/multilingual.module';

import { AnalyseEffects, SelectEffects } from './effects/index';
import { AnalyseService, SelectService } from './services/index';


@NgModule({
  imports: [
    CommonModule, 
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([AnalyseEffects,SelectEffects])
  ],
  declarations: [],
  providers: [AnalyseService, SelectService],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    SharedModule,    
  ],
})
export class AnalyseModule {
  constructor(@Optional() @SkipSelf() parentModule: AnalyseModule) {
    if (parentModule) {
      throw new Error('AnalyseModule already loaded; Import in root module only.');
    }
  }
}