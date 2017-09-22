// angular
import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { DBModule } from '@ngrx/db';

// module
import { SharedModule } from '../shared/index';
import { BooksModule } from '../books/index';
import { CountriesModule } from '../countries/index';
import { AuthModule } from '../auth/index';
import { CORE_DIRECTIVES } from './directives/index';
import { CORE_PROVIDERS } from './services/index';
import { Config } from './utils/index';
import { schema } from '../db/index';

interface ICoreModuleOptions {
  window?: any;
  console?: any;
}

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    SharedModule,
    BooksModule,
    CountriesModule,
    AuthModule,
    DBModule.provideDB(schema),    
  ],
  declarations: [
    ...CORE_DIRECTIVES
  ],
  exports: [
    ...CORE_DIRECTIVES
  ],
  providers: [
    ...CORE_PROVIDERS,
    SharedModule
  ]
})
export class CoreModule {
  // configuredProviders: *required to configure WindowService and ConsoleService per platform
  static forRoot(configuredProviders: Array<any>): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: configuredProviders
    };
  }
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule already loaded; Import in root module only.');
    }
  }
}
