// angular
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';

// libs
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader } from '@ngx-translate/core';

// app
import { APP_COMPONENTS, AppComponent } from './app/components/index';
import { routes } from './app/components/app.routes';

// feature modules
import { WindowService, StorageService, ConsoleService, createConsoleTarget, provideConsoleTarget, LogTarget, LogLevel, ConsoleTarget } from './app/modules/core/services/index';
import { CoreModule, Config } from './app/modules/core/index';
import { MultilingualModule, Languages, translateLoaderFactory, MultilingualEffects } from './app/modules/i18n/index';
import { MainModule, MainEffects } from './app/modules/main/index';
import { AppReducer } from './app/modules/ngrx/index';

// config
Config.PLATFORM_TARGET = Config.PLATFORMS.WEB;
if (String('<%= BUILD_TYPE %>') === 'dev') {
  // only output console logging in dev mode
  Config.DEBUG.LEVEL_4 = true;
}

let routerModule = RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'});

if (String('<%= TARGET_DESKTOP %>') === 'true') {
  Config.PLATFORM_TARGET = Config.PLATFORMS.DESKTOP;
  // desktop (electron) must use hash
  routerModule = RouterModule.forRoot(routes, { useHash: true });
}

declare var window, console, localStorage;

// For AoT compilation to work:
export function win() {
  return window;
}
export function storage() {
  return localStorage;
}
export function cons() {
  return console;
}
export function consoleLogTarget(consoleService: ConsoleService) {
  return new ConsoleTarget(consoleService, { minLogLevel: LogLevel.Debug });
}

let DEV_IMPORTS: any[] = [];

if (String('<%= BUILD_TYPE %>') === 'dev') {
  DEV_IMPORTS = [
    ...DEV_IMPORTS,
    StoreDevtoolsModule.instrument()
  ];
}

@NgModule({
  imports: [
    BrowserModule, Angular2FontawesomeModule,
    CoreModule.forRoot([
      { provide: WindowService, useFactory: (win) },
      { provide: StorageService, useFactory: (storage) },
      { provide: ConsoleService, useFactory: (cons) },
      { provide: LogTarget, useFactory: (consoleLogTarget), deps: [ConsoleService], multi: true }
    ]),
    routerModule,
    MultilingualModule.forRoot([{
      provide: TranslateLoader,
      deps: [HttpClient],
      useFactory: (translateLoaderFactory)
    }]),
    MainModule,
    // configure app state
    StoreModule.forRoot(AppReducer),
    EffectsModule.forRoot([MultilingualEffects,MainEffects]),
    // dev environment only imports
    DEV_IMPORTS,
  ],
  declarations: [
    APP_COMPONENTS
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    // override with supported languages
    {
      provide: Languages,
      useValue: Config.GET_SUPPORTED_LANGUAGES()
    }
  ],
  bootstrap: [AppComponent]
})

export class WebModule { }
