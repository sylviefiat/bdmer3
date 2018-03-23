import { TransectFormPageComponent } from './transect-form-page.component';
import { TransectImportPageComponent } from './transect-import-page.component';
import { ViewTransectPageComponent } from './view-transect-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const TransectRoutes: Array<any> = [
  /*{
    path: 'transect',
    component: TransectListPageComponent,
    canActivate : [AuthGuard]
  }, */
  {
    path: 'transectForm/:idPlatform/:idZone',
    component: TransectFormPageComponent,
    canActivate : [AuthGuard]
  },{
    path: 'transectForm/:idPlatform/:idZone/:idTransect',
    component: TransectFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'transectImport/:idPlatform',
    component: TransectImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'transectImport/:idPlatform/:idZone',
    component: TransectImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'transect/:idPlatform/:idZone/:idTransect',
    component: ViewTransectPageComponent,
    canActivate : [AuthGuard]
  }
]