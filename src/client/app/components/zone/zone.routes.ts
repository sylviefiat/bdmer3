import { ZoneFormPageComponent } from './zone-form-page.component';
import { ZoneImportPageComponent } from './zone-import-page.component';
import { ViewZonePageComponent } from './view-zone-page.component';
import { AuthGuard } from '../../modules/auth/guards/index';

export const ZoneRoutes: Array<any> = [
  /*{
    path: 'zone',
    component: ZoneListPageComponent,
    canActivate : [AuthGuard]
  }, */{
    path: 'zoneForm',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zoneForm/:idSite/:idZone',
    component: ZoneFormPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zoneImport',
    component: ZoneImportPageComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'zone/:id',
    component: ViewZonePageComponent,
    canActivate : [AuthGuard]
  }
]