
import { ManagementPageComponent } from './management-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const ManagementRoutes: Array<any> = [
  {
    path: 'management',
    component: ManagementPageComponent,
    canActivate : [AuthGuard]
  }
];
