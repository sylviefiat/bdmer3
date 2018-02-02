import { CountFormPageComponent } from './count-form-page.component';
import { CountImportPageComponent } from './count-import-page.component';
import { ViewCountPageComponent } from './view-count-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const CountRoutes: Array<any> = [
  
  {
    path: 'count/:idSite/:idZone/:idCampaign/:idCount',
    component: ViewCountPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'countForm/:idSite/:idZone/:idCampaign',
    component: CountFormPageComponent,
    canActivate : [AuthGuard]
  },{
    path: 'countForm/:idSite/:idZone/:idCampaign/:idCount',
    component: CountFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'countImport/:idSite',
    component: CountImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'count/:idSite/:idZone/:idCampaign',
    component: ViewCountPageComponent,
    canActivate : [AuthGuard]
  }
]