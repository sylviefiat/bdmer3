import { PreferenceAreaFormPageComponent } from './preference-area-form-page.component';
import { PreferenceAreaImportPageComponent } from './preference-area-import-page.component';
import { ViewPreferenceAreaPageComponent } from './view-preference-area-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const PreferenceAreaRoutes: Array<any> = [
  /*{
    path: 'transect',
    component: TransectListPageComponent,
    canActivate : [AuthGuard]
  }, */
  {
    path: 'zonePrefForm/:idSite/:idZone',
    component: PreferenceAreaFormPageComponent,
    canActivate : [AuthGuard]
  },{
    path: 'zonePrefForm/:idSite/:idZone/:idZonePref',
    component: PreferenceAreaFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zonePrefImport/:idSite/:idZone',
    component: PreferenceAreaImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zonePref/:idSite/:idZone/:idZonePref',
    component: ViewPreferenceAreaPageComponent,
    canActivate : [AuthGuard]
  }
]