import { LoginPageComponent } from './login-page.component';
import { LogoutComponent } from './logout.component';
import { SignupPageComponent } from './signup-page.component';

export const LoginRoutes: Array<any> = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'signup',
    component: SignupPageComponent
  }
];
