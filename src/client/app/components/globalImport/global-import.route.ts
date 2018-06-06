import { GlobalImportPageComponent } from './global-import-page.component';
import { AuthGuard, DeactivateGuardService } from '../../modules/auth/guards/index';

export const GlobalImportRoutes: Array<any> = [
  {
    path: 'globalImport/:idPlatform',
    component: GlobalImportPageComponent,
    canActivate : [AuthGuard],
    canDeactivate: [DeactivateGuardService]
  }
]