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
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'countries/:id',
    component: ViewCountryPageComponent, 
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'newcountry',
    component: NewCountryPageComponent, 
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'countries/:idCountry/userForm',
    component: NewUserPageComponent, 
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'countries/:idCountry/userForm/:idUser',
    component: NewUserPageComponent, 
    canActivate : [AuthGuard],
    runGuardsAndResolvers: 'always'
  }
];
