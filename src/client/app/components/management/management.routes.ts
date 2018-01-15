
import { ManagementPageComponent } from './management-page.component';
import { SiteFormPageComponent } from './site/site-form-page.component';
import { SiteImportPageComponent } from './site/site-import-page.component';
import { ViewSitePageComponent } from './site/view-site-page.component';
import { ZoneFormPageComponent } from './zone/zone-form-page.component';
import { ZoneImportPageComponent } from './zone/zone-import-page.component';
import { ViewZonePageComponent } from './zone/view-zone-page.component';
import { TransectFormPageComponent } from './transect/transect-form-page.component';
import { TransectImportPageComponent } from './transect/transect-import-page.component';
import { ViewTransectPageComponent } from './transect/view-transect-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const ManagementRoutes: Array<any> = [
  {
    path: 'management',
    component: ManagementPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'siteForm',
    component: SiteFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'siteForm/:id',
    component: SiteFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'siteImport',
    component: SiteImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'site/:id',
    component: ViewSitePageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zoneForm/:idsite',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zoneForm/:idsite/:idzone',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zoneImport/:idsite',
    component: ZoneImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zone/:idsite/:idzone',
    component: ViewZonePageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'transectForm/:idsite/:idzone',
    component: TransectFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'transectForm/:idsite/:idzone/:idtransect',
    component: TransectFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'transectImport/:idsite/:idzone',
    component: TransectImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'transect/:idsite/:idzone/:idtransect',
    component: ViewTransectPageComponent,
    canActivate : [AuthGuard]
  }
];
