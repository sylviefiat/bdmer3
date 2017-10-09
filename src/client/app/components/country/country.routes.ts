import { CountryPageComponent } from './country-page.component';
import { ViewCountryPageComponent } from './view-country-page.component';
import { ViewUserPageComponent } from './view-user-page.component';
import { NewCountryPageComponent } from './new-country-page.component';
import { NewUserPageComponent } from './new-user-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const CountryRoutes: Array<any> = [
  {
    path: 'countries',
    component: CountryPageComponent,
  },
  {
    path: 'countries/:id',
    component: ViewCountryPageComponent, 
    canActivate : [AuthGuard]
  },
  {
    path: 'newcountry',
    component: NewCountryPageComponent, 
    canActivate : [AuthGuard]
  },
  {
    path: 'countries/:id/newuser',
    component: NewUserPageComponent, 
    canActivate : [AuthGuard]
  }
];
