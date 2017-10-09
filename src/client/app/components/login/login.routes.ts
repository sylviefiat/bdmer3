import { LoginPageComponent } from './login-page.component';
import { LogoutComponent } from './logout.component';
import { LostPasswordComponent } from './lost-password.component';

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
    path: 'lostpassword',
    component: LostPasswordComponent
  }
];
