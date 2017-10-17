
import { ManagementPageComponent } from './management-page.component';
import { NewSpeciesPageComponent } from './species/new-species-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const ManagementRoutes: Array<any> = [
  {
    path: 'management',
    component: ManagementPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'newSpeciesForm',
    component: NewSpeciesPageComponent,
    canActivate : [AuthGuard]
  }
];
