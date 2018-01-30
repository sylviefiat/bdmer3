// app
import { HomeRoutes } from './home/home.routes';
import { AboutRoutes } from './about/about.routes';
import { BookRoutes } from './book/book.routes';
import { MapRoutes } from './map/map.routes';
import { LoginRoutes } from './login/login.routes';
import { CountryRoutes } from './country/country.routes';
import { SiteRoutes } from './site/site.routes';
import { SpeciesRoutes } from './species/species.routes';
import { CampaignRoutes } from './campaign/campaign.routes';
import { TransectRoutes } from './transect/transect.routes';
import { PreferenceAreaRoutes } from './preference-area/preference-area.routes';
import { ZoneRoutes } from './zone/zone.routes';
import { CountRoutes } from './count/count.routes';
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
  ...CampaignRoutes,
  ...TransectRoutes,
  ...PreferenceAreaRoutes,
  ...ZoneRoutes,
  ...CountRoutes,
  { path: '**', component: NotFoundPageComponent }
];
