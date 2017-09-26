import { CountryPageComponent } from './country-page.component';
import { ViewCountryPageComponent } from './view-country-page.component';
import { ViewUserPageComponent } from './view-user-page.component';
import { NewCountryPageComponent } from './new-country-page.component';

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
    path: 'countries/users/:id',
    component: ViewUserPageComponent
  },
  {
    path: 'newcountry',
    component: NewCountryPageComponent
  },
];
