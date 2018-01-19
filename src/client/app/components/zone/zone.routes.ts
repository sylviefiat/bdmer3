import { ZoneFormPageComponent } from './zone-form-page.component';
import { ZoneImportPageComponent } from './zone-import-page.component';
import { ViewZonePageComponent } from './view-zone-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const ZoneRoutes: Array<any> = [
  /*{
    path: 'zone',
    component: ZoneListPageComponent,
    canActivate : [AuthGuard]
  }, */
  {
    path: 'zoneForm/:idSite/:idZone',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zoneForm/:idSite',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zoneImport/:idSite',
    component: ZoneImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zone/:idSite/:idZone',
    component: ViewZonePageComponent,
    canActivate : [AuthGuard]
  }
]