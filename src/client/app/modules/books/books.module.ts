import { NgModule, Optional, SkipSelf, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/index';
import { MultilingualModule } from '../i18n/multilingual.module';

import { BookEffects, CollectionEffects } from './effects/index';
import { BookExistsGuard } from './guards/book-exists';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    EffectsModule.run(BookEffects),
    EffectsModule.run(CollectionEffects)
  ],
  declarations: [],
  providers: [BookExistsGuard],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    SharedModule
  ]
})
export class BooksModule {
  constructor(@Optional() @SkipSelf() parentModule: BooksModule) {
    if (parentModule) {
      throw new Error('BooksModule already loaded; Import in root module only.');
    }
  }
}
