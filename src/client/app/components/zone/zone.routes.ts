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
    path: 'zoneForm/:idPlatform/:idZone',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zoneForm/:idPlatform',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zoneImport/:idPlatform',
    component: ZoneImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zone/:idPlatform/:idZone',
    component: ViewZonePageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zone/:idPlatform/:idZone/:view',
    component: ViewZonePageComponent,
    canActivate : [AuthGuard]
  }
]