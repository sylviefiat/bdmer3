// app
import { HomeRoutes } from './home/home.routes';
import { AboutRoutes } from './about/about.routes';
import { LoginRoutes } from './login/login.routes';
import { CountryRoutes } from './country/country.routes';
import { PlatformRoutes } from './platform/platform.routes';
import { SpeciesRoutes } from './species/species.routes';
import { SurveyRoutes } from './survey/survey.routes';
import { StationRoutes } from './station/station.routes';
import { PreferenceAreaRoutes } from './preference-area/preference-area.routes';
import { GlobalImportRoutes } from './globalImport/global-import.route';
import { ZoneRoutes } from './zone/zone.routes';
import { CountRoutes } from './count/count.routes';
import { AnalyseRoutes } from './analyse/analyse.routes';
import { NotFoundPageComponent } from '../modules/shared/components/not-found-page';

export const routes: Array<any> = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...LoginRoutes,
  ...CountryRoutes,
  ...PlatformRoutes,
  ...SpeciesRoutes,
  ...SurveyRoutes,
  ...StationRoutes,
  ...PreferenceAreaRoutes,
  ...ZoneRoutes,
  ...CountRoutes,
  ...AnalyseRoutes,
  ...GlobalImportRoutes,
  { path: '**', component: NotFoundPageComponent }
];
