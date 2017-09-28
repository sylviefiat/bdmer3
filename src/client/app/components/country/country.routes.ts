import { CountryPageComponent } from './country-page.component';
import { ViewCountryPageComponent } from './view-country-page.component';
import { ViewUserPageComponent } from './view-user-page.component';
import { NewCountryPageComponent } from './new-country-page.component';
import { NewUserPageComponent } from './new-user-page.component';

export const CountryRoutes: Array<any> = [
  {
    path: 'countries',
    component: CountryPageComponent
  },
  {
    path: 'countries/:id',
    component: ViewCountryPageComponent
  },
  {
    path: 'newcountry',
    component: NewCountryPageComponent
  },
  {
    path: 'countries/:id/newuser',
    component: NewUserPageComponent
  },
  {
    path: 'countries/:id/:username',
    component: ViewUserPageComponent
  },
];
