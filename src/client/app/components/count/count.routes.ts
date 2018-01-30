import { CountFormPageComponent } from './count-form-page.component';
import { CountImportPageComponent } from './count-import-page.component';
import { ViewCountPageComponent } from './view-count-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const CountRoutes: Array<any> = [
  /*{
    path: 'transect',
    component: TransectListPageComponent,
    canActivate : [AuthGuard]
  }, */
  {
    path: 'countForm/:idSite/:idZone',
    component: CountFormPageComponent,
    canActivate : [AuthGuard]
  },{
    path: 'countForm/:idSite/:idZone/:idTransect',
    component: CountFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'countImport/:idSite',
    component: CountImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'count/:idSite/:idZone/:idTransect',
    component: ViewCountPageComponent,
    canActivate : [AuthGuard]
  }
]