// app
import { HomeRoutes } from './home/home.routes';
import { AboutRoutes } from './about/about.routes';
import { BookRoutes } from './book/book.routes';
import { MapRoutes } from './map/map.routes';
import { LoginRoutes } from './login/login.routes';
import { CountryRoutes } from './country/country.routes';
import { SiteRoutes } from './site/site.routes';
import { SpeciesRoutes } from './species/species.routes';
import { TransectRoutes } from './transect/transect.routes';
import { ZoneRoutes } from './zone/zone.routes';
import { NotFoundPageComponent } from '../modules/shared/components/not-found-page';

export const routes: Array<any> = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...BookRoutes,
  ...MapRoutes,
  ...LoginRoutes,
  ...CountryRoutes,
  ...SiteRoutes,
  ...SpeciesRoutes,
  ...TransectRoutes,
  ...ZoneRoutes,
  { path: '**', component: NotFoundPageComponent }
];
