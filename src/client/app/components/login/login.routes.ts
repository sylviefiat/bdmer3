import { LoginPageComponent } from './login-page.component';
import { LogoutComponent } from './logout.component';
import { LostPasswordComponent } from './lost-password.component';

export const LoginRoutes: Array<any> = [
  {
    path: 'login',
    component: LoginPageComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'logout',
    component: LogoutComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'lostpassword',
    component: LostPasswordComponent,
    runGuardsAndResolvers: 'always'
  }
];
