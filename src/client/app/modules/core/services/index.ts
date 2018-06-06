// app
import { ConsoleService } from './console.service';
import { LogService } from './logging/log.service';
import { RouterExtensions } from './router-extensions.service';
import { WindowService } from './window.service';
import { AppService } from './app.service';
import { StorageService } from './storage.service';
import { PouchDBService } from './pouchdb.service';
import { CountriesService } from './countries.service';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { MomentService } from './moment.service';
import { Csv2JsonService } from './csv2json.service';
import { MapStaticService} from './map-static.service';
import { NameRefactorService } from './nameRefactor.service';
import { GeojsonService } from './geojson.service';

export const CORE_PROVIDERS: any[] = [
  WindowService,
  StorageService,
  PouchDBService,
  ConsoleService,
  LogService,
  AppService,
  RouterExtensions,
  CountriesService,
  AuthService,
  MailService,
  MomentService,
  Csv2JsonService,
  MapStaticService,
  NameRefactorService,
  GeojsonService
];

export * from './console.service';
export * from './logging/index';
export * from './router-extensions.service';
export * from './window.service';
export * from './app.service';
export * from './storage.service';
export * from './pouchdb.service';
export * from './countries.service';
export * from './auth.service';
export * from './mail.service';
export * from './moment.service';
export * from './csv2json.service';
export * from './map-static.service';
export * from './nameRefactor.service';
export * from './geojson.service';