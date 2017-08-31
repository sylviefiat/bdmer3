import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/index';
import { MultilingualModule } from '../i18n/multilingual.module';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth-guard.service';
import { AuthEffects } from './effects/auth.effects';


@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule, 
    MaterialModule,
    RouterModule,
    SharedModule,
    MultilingualModule,
  ],
  declarations: [],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    SharedModule
  ],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootAuthModule,
      providers: [AuthService, AuthGuard],
    };
  }
}

@NgModule({
  imports: [
    AuthModule,
    EffectsModule.run(AuthEffects),
  ],
})
export class RootAuthModule {}