// app
import { ConsoleService } from './console.service';
import { LogService } from './logging/log.service';
import { RouterExtensions } from './router-extensions.service';
import { WindowService } from './window.service';
import { AppService } from './app.service';
import { StorageService } from './storage.service';
import { PouchDBService } from './pouchdb.service';
import { GoogleBooksService } from './google-books';
import { CountriesService } from './countries.service';
import { AuthService } from './auth.service';

export const CORE_PROVIDERS: any[] = [
  WindowService,
  StorageService,
  PouchDBService,
  ConsoleService,
  LogService,
  AppService,
  RouterExtensions,
  GoogleBooksService,
  CountriesService,
  AuthService,
];

export * from './console.service';
export * from './logging/index';
export * from './router-extensions.service';
export * from './window.service';
export * from './app.service';
export * from './storage.service';
export * from './pouchdb.service';
export * from './google-books';
export * from './countries.service';
export * from './auth.service';

