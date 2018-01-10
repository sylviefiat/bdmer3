import { NgModule, ModuleWithProviders, Optional, SkipSelf,NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/index';
import { MultilingualModule } from '../i18n/multilingual.module';

//import { AUTH_PROVIDERS } from './services/index';
import { AuthGuard } from './guards/auth-guard.service';
import { AuthEffects } from './effects/auth.effects';


@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule, 
    RouterModule,
    SharedModule,
    MultilingualModule,
    EffectsModule.run(AuthEffects),
  ],
  declarations: [],
  providers: [AuthGuard],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    SharedModule
  ],
})
export class AuthModule {
  constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error('AuthModule already loaded; Import in root module only.');
    }
  }
}