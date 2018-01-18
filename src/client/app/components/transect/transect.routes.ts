import { TransectFormPageComponent } from './transect-form-page.component';
import { TransectImportPageComponent } from './transect-import-page.component';
import { ViewTransectPageComponent } from './view-transect-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const TransectRoutes: Array<any> = [
  /*{
    path: 'transect',
    component: TransectListPageComponent,
    canActivate : [AuthGuard]
  }, */{
    path: 'transectForm',
    component: TransectFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'transectForm/:idSite/:idZone/:idTransect',
    component: TransectFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'transectImport',
    component: TransectImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'transect/:id',
    component: ViewTransectPageComponent,
    canActivate : [AuthGuard]
  }
]