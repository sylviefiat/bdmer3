import { GlobalImportPageComponent } from './global-import-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const GlobalImportRoutes: Array<any> = [
  {
    path: 'globalImport/:idPlatform',
    component: GlobalImportPageComponent,
    canActivate : [AuthGuard]
  }
]